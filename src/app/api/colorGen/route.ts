import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


const paletteSchema = z.object({
  reasoning: z.string().describe("A very detailed portuguese reasoning for the color palette splitted in bullet points and paragraphs, max. 800 words markdown formatted"),
  hexes: z.array(z.string()).describe("A list of 5 HEX color codes"),
});
export type IPaletteSchema = z.infer<typeof paletteSchema>;

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

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
            "You are an AI that generates palettes of colors based on the user prompt, always taking in consideration design and colors concepts to match the colors, explain your colors choices detailed using lists and paragraphs, colors theory and format it in markdown",
        },
        {
          role: "user",
          content: `Generate a palette of HEX pattern colors for me based on this description: ${prompt}.`,
        },
      ],
    });

    clearTimeout(timeout)
    const palette = completion.choices[0].message.parsed;
    
    return NextResponse.json(palette);
  } catch (e) {
    console.error(e);
    return NextResponse.json({error:e}, {status:500})
  }
}
