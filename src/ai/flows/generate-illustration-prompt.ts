// src/ai/flows/generate-illustration-prompt.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that takes a user's hand-drawn sketch and generates
 *               a polished digital illustration with prompt suggestions for further refinement.
 *
 * - generateIllustration - A function that processes the sketch and returns an enhanced illustration with suggested prompts.
 * - GenerateIllustrationInput - The input type for the generateIllustration function, including the sketch data URI.
 * - GenerateIllustrationOutput - The return type, containing the enhanced illustration data URI and prompt suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateIllustrationInputSchema = z.object({
  sketchDataUri: z
    .string()
    .describe(
      'A hand-drawn sketch as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateIllustrationInput = z.infer<typeof GenerateIllustrationInputSchema>;

// Define the output schema for the flow
const GenerateIllustrationOutputSchema = z.object({
  enhancedIllustrationDataUri: z
    .string()
    .describe(
      'The enhanced digital illustration as a data URI, including MIME type and Base64 encoding.'
    ),
  promptSuggestions: z
    .array(z.string())
    .describe('An array of suggested prompts to further refine the illustration.'),
});
export type GenerateIllustrationOutput = z.infer<typeof GenerateIllustrationOutputSchema>;

// Exported function to call the flow
export async function generateIllustration(
  input: GenerateIllustrationInput
): Promise<GenerateIllustrationOutput> {
  return generateIllustrationFlow(input);
}

// Define the prompt for generating the illustration and suggestions
const illustrationPrompt = ai.definePrompt({
  name: 'illustrationPrompt',
  input: {schema: GenerateIllustrationInputSchema},
  output: {schema: GenerateIllustrationOutputSchema},
  prompt: `You are an AI assistant that enhances hand-drawn sketches into polished digital illustrations.

You receive a sketch as a data URI. Enhance this sketch by applying colors, smoothing lines, and adding details to create a visually appealing digital illustration.

Also, suggest three different prompts that the user could use to further refine the illustration. These prompts should be creative and specific, guiding the AI to make targeted improvements.

Sketch: {{media url=sketchDataUri}}

Output the enhanced illustration as a data URI and the prompt suggestions as an array of strings.
`,
});

// Define the Genkit flow
const generateIllustrationFlow = ai.defineFlow(
  {
    name: 'generateIllustrationFlow',
    inputSchema: GenerateIllustrationInputSchema,
    outputSchema: GenerateIllustrationOutputSchema,
  },
  async input => {
    // Call the prompt to generate the enhanced illustration and prompt suggestions
    const {output} = await illustrationPrompt(input);
    return output!;
  }
);
