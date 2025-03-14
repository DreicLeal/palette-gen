import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";




const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

export async function POST(req: Request) {
    const { setRegeneratedData } = await req.json();

    const paletteSchema = z.object({
      hexes: z.array(z.string()).describe(`A list of ${setRegeneratedData.quantityToRegen} HEX color codes`),
    });
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(paletteSchema, "palette"),
      messages: [
        {
          role: "system",
          content:
            "You are an AI that regenerates matching colors, always taking in consideration design and colors concepts to match the colors. avoid repetition.",
        },
        {
          role: "user",
          content: `Regenerates ${setRegeneratedData.quantityToRegen} color${setRegeneratedData.quantityToRegen>1?"s":""} matching the colors provided, different from this palette: ${setRegeneratedData.currentHexes}, but matching.`,
        },
      ],
    });
    const palette = completion.choices[0].message.parsed;
    if (!palette) {
      throw new Error("Failed to generate the colors");
    }
    return NextResponse.json(palette);
  } catch (e) {
    console.error(e);
  }
}
