import { GoogleGenAI } from "@google/genai";
import { UserProfile, FinancialGoal } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialAdvice = async (
  user: UserProfile, 
  goals: FinancialGoal[],
  query?: string
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment to use the AI Advisor.";
  }

  try {
    const goalSummary = goals.map(g => `${g.name}: $${g.currentAmount} / $${g.targetAmount} by ${g.deadlineYear}`).join('\n');
    
    const prompt = `
      You are an expert financial advisor for a major investment firm.
      
      User Profile:
      - Age: ${user.age}
      - Annual Income: $${user.annualIncome}
      - Current Savings: $${user.currentSavings}
      - Monthly Contribution: $${user.monthlyContribution}
      - Risk Tolerance: ${user.riskTolerance}
      - Planned Retirement Age: ${user.retirementAge}

      Current Goals:
      ${goalSummary}

      ${query ? `User Specific Question: "${query}"` : "Please provide a brief assessment of my financial health and 3 concrete, actionable steps to improve my probability of success."}

      Keep the tone professional, encouraging, and clear. Format the response with Markdown headers and bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "I couldn't generate advice at this moment. Please try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing your plan. Please try again.";
  }
};