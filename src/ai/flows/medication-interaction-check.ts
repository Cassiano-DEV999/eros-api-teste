'use server';
/**
 * @fileOverview Checks for potential medication interactions and side effects.
 *
 * - medicationInteractionCheck - A function that checks for medication interactions.
 * - MedicationInteractionInput - The input type for the medicationInteractionCheck function.
 * - MedicationInteractionOutput - The return type for the medicationInteractionCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationInteractionInputSchema = z.object({
  medicationList: z
    .array(z.string())
    .describe('List of medications the user intends to take.'),
});
export type MedicationInteractionInput = z.infer<
  typeof MedicationInteractionInputSchema
>;

const MedicationInteractionOutputSchema = z.object({
  hasInteractions: z.boolean().describe('Whether there are any interactions.'),
  interactions: z
    .array(z.string())
    .describe('List of potential interactions or side effects.'),
});
export type MedicationInteractionOutput = z.infer<
  typeof MedicationInteractionOutputSchema
>;

export async function medicationInteractionCheck(
  input: MedicationInteractionInput
): Promise<MedicationInteractionOutput> {
  return medicationInteractionCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationInteractionPrompt',
  input: {schema: MedicationInteractionInputSchema},
  output: {schema: MedicationInteractionOutputSchema},
  prompt: `You are a clinical pharmacist specializing in medication safety for pregnant individuals.

  Given the following list of medications and supplements, identify any potential drug-drug interactions, contraindications during pregnancy, or significant side effects.

  Medications: {{{medicationList}}}

  Provide a detailed explanation of each potential interaction or side effect, and its severity. If there are no interactions say so.
  Respond in the following format:
  {
    hasInteractions: true/false,
    interactions: ["interaction 1", "interaction 2", ...]
  }
`,
});

const medicationInteractionCheckFlow = ai.defineFlow(
  {
    name: 'medicationInteractionCheckFlow',
    inputSchema: MedicationInteractionInputSchema,
    outputSchema: MedicationInteractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
