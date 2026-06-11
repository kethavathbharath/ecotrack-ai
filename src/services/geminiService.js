/**
 * Google Gemini AI Service
 * Handles all Gemini API interactions for recommendations and predictions
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// gemini-1.5-flash has higher free tier quota than gemini-2.0-flash
const GEMINI_MODEL   = 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/**
 * Make a Gemini API request
 */
async function callGemini(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY,   // header-based auth (matches curl)
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Parse structured recommendations from Gemini text ────────────────────────
function parseRecommendations(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const recs = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    // Detect numbered items or bullet points as new recommendations
    if (/^(\d+\.|[-*•])\s/.test(trimmed)) {
      if (current) recs.push(current);
      const title = trimmed.replace(/^(\d+\.|[-*•])\s*\*?\*?/, '').replace(/\*\*$/, '').trim();
      current = { id: Date.now() + recs.length, title, description: '', impact: '', category: 'general' };
    } else if (current) {
      if (trimmed.toLowerCase().includes('impact') || trimmed.toLowerCase().includes('reduce') || trimmed.toLowerCase().includes('save')) {
        current.impact = trimmed.replace(/^[*_-]+|[*_-]+$/g, '').trim();
      } else if (trimmed.length > 0 && !current.description) {
        current.description = trimmed.replace(/^[*_-]+|[*_-]+$/g, '').trim();
      }
    }
  }
  if (current) recs.push(current);

  return recs.slice(0, 6).map((r, i) => ({
    ...r,
    id: i + 1,
    category: detectCategory(r.title),
    icon: getCategoryIcon(detectCategory(r.title)),
  }));
}

function detectCategory(title = '') {
  const t = title.toLowerCase();
  if (t.includes('car') || t.includes('transport') || t.includes('driv') || t.includes('commut')) return 'transport';
  if (t.includes('electr') || t.includes('energy') || t.includes('power') || t.includes('light')) return 'electricity';
  if (t.includes('food') || t.includes('meat') || t.includes('diet') || t.includes('veg')) return 'food';
  if (t.includes('plastic') || t.includes('waste') || t.includes('recycl')) return 'waste';
  return 'lifestyle';
}

function getCategoryIcon(cat) {
  const icons = { transport: '🚗', electricity: '⚡', food: '🥗', waste: '♻️', lifestyle: '🌿' };
  return icons[cat] || '🌱';
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get personalized carbon reduction recommendations from Gemini.
 * @param {Object} emissions - emission breakdown
 * @param {number} ecoScore - current eco score
 * @returns {Promise<Array>} array of recommendation objects
 */
export async function getAIRecommendations(emissions, ecoScore) {
  const prompt = `You are an expert sustainability consultant. Based on the following monthly carbon footprint data for a person in India, provide exactly 6 specific, actionable carbon reduction recommendations.

Carbon Footprint Data:
- Total Monthly CO2: ${emissions.total} kg
- Transport emissions: ${emissions.transport} kg (Car: ${emissions.carEmissions} kg, Bus: ${emissions.busEmissions} kg)
- Electricity emissions: ${emissions.electricity} kg
- Food emissions: ${emissions.food} kg
- Plastic waste emissions: ${emissions.plastic} kg
- Eco Score: ${ecoScore}/100

Requirements:
1. Each recommendation must be practical and specific to their usage patterns
2. Focus on the highest-emitting categories first
3. Include estimated CO2 reduction for each tip
4. Use simple, encouraging language
5. Make recommendations relevant to an Indian urban context

Format each recommendation as:
[NUMBER]. [TITLE]
[Brief description of what to do]
Impact: [Specific CO2 reduction estimate, e.g., "Saves ~45 kg CO2/month"]

Provide exactly 6 numbered recommendations.`;

  const text = await callGemini(prompt);
  return parseRecommendations(text);
}

/**
 * Get AI prediction analysis and preventive suggestions.
 * @param {Array} history - array of past calculations
 * @param {Object} prediction - prediction result from calculations util
 * @returns {Promise<Object>} analysis and suggestions
 */
export async function getAIPrediction(history, prediction) {
  if (!history || history.length < 2) {
    throw new Error('Need at least 2 data points for prediction');
  }

  const recent = history.slice(0, 5).reverse();
  const historyText = recent.map((h, i) => 
    `Month ${i + 1}: ${h.total} kg CO2 (Transport: ${h.transport} kg, Electricity: ${h.electricity} kg, Food: ${h.food} kg)`
  ).join('\n');

  const prompt = `You are an AI sustainability analyst. Based on the historical carbon footprint data below, analyze the trend and provide actionable predictions and preventive suggestions.

Historical Data (oldest to newest):
${historyText}

Statistical Prediction for Next Month: ${prediction.predicted} kg CO2
Trend: ${prediction.trend} (${prediction.changePercent > 0 ? '+' : ''}${prediction.changePercent}% slope)
Prediction Confidence: ${prediction.confidence}

Please provide:
1. A brief analysis of the trend (2-3 sentences)
2. Three specific preventive suggestions to reduce next month's footprint
3. One motivational insight

Format your response as:
ANALYSIS: [Your trend analysis]
SUGGESTIONS:
- [Suggestion 1 with expected impact]
- [Suggestion 2 with expected impact]
- [Suggestion 3 with expected impact]
MOTIVATION: [Motivational insight]`;

  const text = await callGemini(prompt);

  // Parse structured response
  const analysisMatch = text.match(/ANALYSIS:\s*(.+?)(?=SUGGESTIONS:|$)/s);
  const suggestionsMatch = text.match(/SUGGESTIONS:\s*(.+?)(?=MOTIVATION:|$)/s);
  const motivationMatch = text.match(/MOTIVATION:\s*(.+?)$/s);

  const suggestionLines = suggestionsMatch?.[1]?.split('\n')
    .filter(l => l.trim().startsWith('-'))
    .map(l => l.replace(/^-\s*/, '').trim()) || [];

  return {
    analysis:    analysisMatch?.[1]?.trim() || text.substring(0, 200),
    suggestions: suggestionLines.length > 0 ? suggestionLines : ['Reduce car usage', 'Optimize electricity usage', 'Eat more plant-based meals'],
    motivation:  motivationMatch?.[1]?.trim() || 'Every small action counts toward a greener future!',
    raw: text,
  };
}

/**
 * Mock recommendations for when API key is not set
 */
export function getMockRecommendations() {
  return [
    {
      id: 1, title: 'Switch to Electric Vehicle or Carpool',
      description: 'Consider carpooling, using public transport, or switching to an electric vehicle for your daily commute.',
      impact: 'Saves ~60–100 kg CO2/month', category: 'transport', icon: '🚗',
    },
    {
      id: 2, title: 'Install LED Lighting Throughout Home',
      description: 'Replace all incandescent bulbs with LED equivalents. LEDs use 75% less energy and last 25x longer.',
      impact: 'Saves ~8–15 kg CO2/month', category: 'electricity', icon: '⚡',
    },
    {
      id: 3, title: 'Adopt a Plant-Rich Diet (3 Days/Week)',
      description: 'Even reducing meat consumption 3 days a week can significantly lower your food carbon footprint.',
      impact: 'Saves ~25–40 kg CO2/month', category: 'food', icon: '🥗',
    },
    {
      id: 4, title: 'Eliminate Single-Use Plastics',
      description: 'Carry a reusable bag, bottle, and container. Refuse plastic straws and packaging whenever possible.',
      impact: 'Saves ~10–20 kg CO2/month', category: 'waste', icon: '♻️',
    },
    {
      id: 5, title: 'Install a Smart Thermostat',
      description: 'A smart thermostat optimizes HVAC usage and can reduce heating/cooling energy by 10–15%.',
      impact: 'Saves ~15–25 kg CO2/month', category: 'electricity', icon: '🌡️',
    },
    {
      id: 6, title: 'Walk or Cycle for Short Trips',
      description: 'For distances under 3 km, opt to walk or cycle instead of driving. Great for health too!',
      impact: 'Saves ~20–35 kg CO2/month', category: 'transport', icon: '🚲',
    },
  ];
}
