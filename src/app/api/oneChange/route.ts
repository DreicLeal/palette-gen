import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const colorSchema = z.object({
  hex: z
    .string()
    .describe(
      "A HEX format color matching the provided palette while avoiding repetition, ensure always start with a '#'"
    ),
});

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

export async function POST(req: Request) {
  try {
    const { colorToChange, fullPalette } = await req.json();
    if (!colorToChange) throw new Error("Missing colorToChange");
    const { primary, secondary, text, accent, background } = fullPalette;
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(colorSchema, "color"),
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates a matching color, ensuring good design and color harmony. Avoid repetition.",
        },
        {
          role: "user",
          content: `Regenerate one color different from: ${colorToChange}, ensuring it harmonizes with the existing palette (${primary}, ${secondary}, ${text}, ${accent}, ${background}).`,
        },
      ],
    });

    const color = completion.choices[0]?.message?.parsed?.hex;
    if (!color) throw new Error("Failed to generate the color");

    return NextResponse.json({ hex: color });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
