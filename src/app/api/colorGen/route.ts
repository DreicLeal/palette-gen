import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

const paletteSchema = z.object({
  reasoning: z.string().describe(
    "A very detailed Portuguese reasoning for the color palette, explaining each category (primary, secondary, accent, background, text) in bullet points and paragraphs. Maximum 800 words, markdown formatted."
  ),
  colors: z.object({
    primary: z.string().describe("The primary color (main brand color) in HEX format."),
    secondary: z.string().describe("The secondary color (supporting brand color) in HEX format."),
    accent: z.string().describe("An accent color for highlights in HEX format."),
    background: z.string().describe("The main background color in HEX format."),
    text: z.string().describe("The primary text color in HEX format."),
  }),
});
export type IPaletteSchema = z.infer<typeof paletteSchema>;

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const { prompt } = await req.json();
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(paletteSchema, "palette"),
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates structured color palettes based on design principles and color theory. The palettes follow a clear hierarchy: \n\n" +
            "- **Primary:** The main color representing the brand or interface. \n" +
            "- **Secondary:** A complementary color that supports the primary. \n" +
            "- **Accent:** A contrasting color for emphasis (e.g., buttons, highlights). \n" +
            "- **Background:** The primary background color for UI elements. \n" +
            "- **Text:** The main color for readability. \n\n" +
            "Explain each choice in a detailed way, using markdown formatting, bullet points, and color theory principles."
        },
        {
          role: "user",
          content: `Generate a hierarchical color palette based on this description: ${prompt}. 
            
            The palette must have:
            - **Primary color** (Main brand identity)
            - **Secondary color** (Supporting brand identity)
            - **Accent color** (Highlight, buttons, interactive elements)
            - **Background color** (Overall background color)
            - **Text color** (Readable and accessible text color)
            
            Format the explanation using markdown and provide strong reasoning for each choice.`,
        },
      ],
    });

    clearTimeout(timeout);
    const palette = completion.choices[0].message.parsed;

    return NextResponse.json(palette);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}