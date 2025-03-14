import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const colorSchema = z.object({
  hex: z.string().describe("just a HEX format color matching the provided palette avoid repetition")
});

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

export async function POST(req: Request) {
  const { colors, colorToChange } = await req.json();
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(colorSchema, "color"),
      messages: [
        {
          role: "system",
          content:
            "You are an AI that regenerates a matching color, always taking in consideration design and colors concepts to match the colors. avoid repetition.",
        },
        {
          role: "user",
          content: `Regenerates only one color matching the colors provided, different from this one: ${colorToChange}, but matching these others: ${colors}.`,
        },
      ],
    });
    const color = completion.choices[0].message.parsed;
    if (!color) {
      throw new Error("Failed to generate the colors");
    }
    return NextResponse.json(color);
  } catch (e) {
    console.error(e);
  }
}
