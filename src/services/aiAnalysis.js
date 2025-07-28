import { MOODS } from '../constants/moods';
import { extractTextFromHtml } from '../utils/helpers';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyAYYEIgbKBTw6d2Gi_hYt2aCBY2bNcn_MU'; // Replace with your actual API key
const GEMINI_MODEL = 'gemini-2.5-flash'; // Using the latest Gemini model

// Main function to analyze journal entries using Gemini API
export const analyzeJournalEntry = async (content) => {
  try {
    const text = extractTextFromHtml(content);
    
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    // Create a structured prompt for mood analysis
    const prompt = `
      Analyze the following journal entry and provide:
      1. Overall mood (1-5 scale where 1 is very sad, 3 is neutral, 5 is very happy)
      2. Confidence level (0-100%)
      3. List of emotions detected (max 5)
      4. Relevant tags for categorization (max 5)
      5. Brief summary (1-2 sentences)
      6. Helpful suggestions based on the mood (max 3)
      
      Format the response as a JSON object with the following structure and dont give anything it in code block or markdown:
      {
        "mood": number,
        "confidence": number,
        "emotions": [string],
        "tags": [string],
        "summary": string,
        "suggestions": [string]
      }
      
      Journal entry: ${text}
    `;
    
    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();
    
    // Parse the JSON response
    const analysisData = JSON.parse(responseText);
    
    // Map the mood value to the corresponding mood object
    const moodObject = MOODS.find(m => m.value === analysisData.mood) || MOODS[2]; // Default to neutral
    
    return {
      mood: moodObject,
      confidence: analysisData.confidence,
      emotions: analysisData.emotions,
      tags: analysisData.tags,
      summary: analysisData.summary,
      suggestions: analysisData.suggestions,
    };
  } catch (error) {
    console.error('Error analyzing journal entry with Gemini:', error);
    
    // Fallback to basic analysis if Gemini API fails
    return fallbackAnalysis(content);
  }
};

// Fallback analysis in case the Gemini API call fails
const fallbackAnalysis = (content) => {
  const text = extractTextFromHtml(content).toLowerCase();
  
  // Simple keyword-based mood detection as fallback
  const moodKeywords = {
    1: ['terrible', 'awful', 'depressed', 'sad', 'crying', 'devastated', 'hopeless', 'miserable'],
    2: ['down', 'upset', 'disappointed', 'frustrated', 'worried', 'anxious', 'stressed'],
    3: ['okay', 'fine', 'normal', 'average', 'neutral', 'alright', 'decent'],
    4: ['good', 'happy', 'pleased', 'content', 'satisfied', 'positive', 'cheerful'],
    5: ['amazing', 'fantastic', 'excellent', 'thrilled', 'ecstatic', 'overjoyed', 'wonderful', 'perfect']
  };
  
  let scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalMatches = 0;
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    for (const keyword of keywords) {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      scores[mood] += matches;
      totalMatches += matches;
    }
  }
  
  // Find the mood with highest score
  let detectedMood = 3; // default neutral
  let maxScore = scores[3];
  
  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedMood = parseInt(mood);
    }
  }
  
  const confidence = totalMatches > 0 ? Math.min(95, Math.round((maxScore / totalMatches) * 100)) : 60;
  
  return {
    mood: MOODS.find(m => m.value === detectedMood),
    confidence,
    emotions: ['Neutral'],
    tags: ['journal'],
    summary: 'Journal entry analyzed with fallback method.',
    suggestions: ['Consider writing more detailed entries to improve analysis.'],
  };
};
