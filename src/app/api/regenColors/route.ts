import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

export async function POST(req: Request) {
  try {
    const { currentColors, rolesToRegen } = await req.json();
    if (!currentColors || !rolesToRegen || rolesToRegen.length === 0) {
      throw new Error("Invalid request: Missing required fields");
    }

    const paletteSchema = z.object(
      Object.fromEntries(
        rolesToRegen.map((role: unknown) => [
          role,
          z.string().describe(`HEX color for ${role}`),
        ])
      )
    );

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(paletteSchema, "palette"),
      messages: [
        {
          role: "system",
          content:
            "You are an AI that regenerates colors while ensuring design harmony and avoiding repetition, make sure that we have a good contrast.",
        },
        {
          role: "user",
          content: `Generate new HEX colors for the following roles: ${rolesToRegen.join(
            ", "
          )}, ensuring they match this palette: ${JSON.stringify(
            currentColors
          )}. The new colors must be different from the current ones but still visually cohesive, make sure that they have good contrast, mainly between background and text.`,
        },
      ],
    });

    const newColors = completion.choices[0]?.message?.parsed;
    if (!newColors) {
      throw new Error("Failed to generate the colors");
    }

    return NextResponse.json({ colors: newColors });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
