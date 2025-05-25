
// This is an auto-generated file from Firebase Studio.

'use server';

/**
 * @fileOverview Enhances a hand-drawn sketch into a polished digital illustration.
 *
 * - enhanceSketch - A function that enhances a sketch.
 * - EnhanceSketchInput - The input type for the enhanceSketch function.
 * - EnhanceSketchOutput - The return type for the enhanceSketch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceSketchInputSchema = z.object({
  sketchDataUri: z
    .string()
    .describe(
      "A hand-drawn sketch as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  styleDescription: z.string().optional().describe('An optional description of the desired artistic style for the illustration. e.g., "cartoonish", "watercolor", "cyberpunk".'),
});
export type EnhanceSketchInput = z.infer<typeof EnhanceSketchInputSchema>;

const EnhanceSketchOutputSchema = z.object({
  enhancedIllustrationDataUri: z
    .string()
    .describe(
      'The enhanced digital illustration as a data URI with MIME type and Base64 encoding.'
    ),
  prompt: z.string().describe('The prompt used to generate the illustration.'),
});
export type EnhanceSketchOutput = z.infer<typeof EnhanceSketchOutputSchema>;

export async function enhanceSketch(input: EnhanceSketchInput): Promise<EnhanceSketchOutput> {
  return enhanceSketchFlow(input);
}

const enhanceSketchPrompt = ai.definePrompt({
  name: 'enhanceSketchPrompt',
  input: {schema: EnhanceSketchInputSchema},
  output: {schema: EnhanceSketchOutputSchema},
  prompt: `Turn this pencil sketch into a beautiful and polished digital illustration. Preserve the original shape and details, but add smooth shading, natural colors, realistic lighting, and professional finishing touches. The result should look like a clean, high-quality artwork.
{{#if styleDescription}}
Apply the following artistic style: {{{styleDescription}}}.
{{/if}}
Sketch: {{media url=sketchDataUri}}`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const enhanceSketchFlow = ai.defineFlow(
  {
    name: 'enhanceSketchFlow',
    inputSchema: EnhanceSketchInputSchema,
    outputSchema: EnhanceSketchOutputSchema,
  },
  async input => {
    let textPrompt = `Turn this pencil sketch into a beautiful and polished digital illustration. Preserve the original shape and details, but add smooth shading, natural colors, realistic lighting, and professional finishing touches. The result should look like a clean, high-quality artwork.`;

    if (input.styleDescription && input.styleDescription.trim() !== '') {
      textPrompt += `\nApply the following artistic style: ${input.styleDescription}.`;
    }

    const {media, text} = await ai.generate({
      prompt: [
        {media: {url: input.sketchDataUri}},
        {
          text: textPrompt,
        },
      ],
      model: 'googleai/gemini-2.0-flash-exp',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      enhancedIllustrationDataUri: media.url,
      prompt: text, // Although we provide a static text prompt, the model might return its own interpretation or a confirmation.
    };
  }
);
