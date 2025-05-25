// src/ai/flows/ai-driven-stock-ordering.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating suggested stock orders
 * based on sales data, current stock levels, and expiration dates.
 *
 * - generateSuggestedOrder - A function that generates a suggested stock order.
 * - GenerateSuggestedOrderInput - The input type for the generateSuggestedOrder function.
 * - GenerateSuggestedOrderOutput - The return type for the generateSuggestedOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestedOrderInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format, including product ID, quantity sold, and date of sale.'),
  stockLevels: z.string().describe('Current stock levels in JSON format, including product ID and quantity in stock.'),
  expirationDates: z.string().describe('Expiration dates in JSON format, including product ID and expiration date.'),
});

export type GenerateSuggestedOrderInput = z.infer<typeof GenerateSuggestedOrderInputSchema>;

const GenerateSuggestedOrderOutputSchema = z.object({
  suggestedOrder: z.string().describe('Suggested order in JSON format, including product ID and quantity to order.'),
  reasoning: z.string().describe('Explanation of why the AI suggested this order.'),
});

export type GenerateSuggestedOrderOutput = z.infer<typeof GenerateSuggestedOrderOutputSchema>;

export async function generateSuggestedOrder(input: GenerateSuggestedOrderInput): Promise<GenerateSuggestedOrderOutput> {
  return generateSuggestedOrderFlow(input);
}

const generateSuggestedOrderPrompt = ai.definePrompt({
  name: 'generateSuggestedOrderPrompt',
  input: {schema: GenerateSuggestedOrderInputSchema},
  output: {schema: GenerateSuggestedOrderOutputSchema},
  prompt: `You are an AI assistant helping pharmacy owners manage their stock.

  Analyze the sales data, current stock levels, and expiration dates to generate a suggested order. The goal is to ensure that the pharmacy never runs out of essential medications while minimizing waste from expired products.

  Sales Data: {{{salesData}}}
  Stock Levels: {{{stockLevels}}}
  Expiration Dates: {{{expirationDates}}}

  Based on this information, suggest an order that optimizes stock levels and minimizes waste. Provide a clear reasoning for the suggested order.

  Format your response as a JSON object with 'suggestedOrder' and 'reasoning' fields. The 'suggestedOrder' field should contain a JSON object with product IDs as keys and quantities to order as values.
  `,
});

const generateSuggestedOrderFlow = ai.defineFlow(
  {
    name: 'generateSuggestedOrderFlow',
    inputSchema: GenerateSuggestedOrderInputSchema,
    outputSchema: GenerateSuggestedOrderOutputSchema,
  },
  async input => {
    const {output} = await generateSuggestedOrderPrompt(input);
    return output!;
  }
);
