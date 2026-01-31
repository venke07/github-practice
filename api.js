/**
 * Interacts with the Gemini API to get a response for the user's query.
 * 
 * @param {string} message - The user's message.
 * @param {Array} history - Array of previous messages {role: 'user'|'model', parts: [{text: string}]}.
 * @param {string} apiKey - The user's Gemini API key.
 * @param {Array} products - The list of available products to use as context.
 * @returns {Promise<string>} - The model's response text.
 */
export async function sendToGemini(message, history, apiKey, products) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Construct a system prompt based on product data
    const systemInstruction = `
    You are Lumina AI, a helpful and enthusiastic shopping assistant for a high-tech e-commerce store called Lumina.
    
    Here is our current product catalog:
    ${productContext}

    Your goal is to help users find products, explain features, and encourage sales in a friendly, premium tone.
    If a user asks about a product not in the list, politely apologize and suggest something similar from our catalog.
    Keep your responses concise and engaging. Do not use markdown unless necessary for lists.
    `;

    const contents = [
        ...history,
        {
            role: "user",
            parts: [{ text: message }]
        }
    ];

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: contents,
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData.error?.message || 'API Request failed';
            throw new Error(errorMsg);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No candidates returned from AI');
        }
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
