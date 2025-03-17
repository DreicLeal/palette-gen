"use client";
import {
  LuCopy,
  LuCopyCheck,
  LuLockOpen,
  LuLock,
  LuRepeat2,
  LuLoader,
} from "react-icons/lu";
import { useState } from "react";
import { useColors } from "@/context/colorsContext";

interface ColorCardProps {
  hex: string;
  role: "primary" | "secondary" | "accent" | "background" | "text";
}

export default function ColorCard({ hex, role }: ColorCardProps) {
  const { setLockedHexes, setPalette, palette, lockedHexes, isRegenerating } =
    useColors();
  const [copy, setCopy] = useState(false);
  const [isRegen, setIsRegen] = useState(false);
  const [locked, setLocked] = useState(lockedHexes.includes(hex));

  const roleStyles = {
    primary: "col-span-4 row-span-5 col-start-1",
    background: "col-span-3 row-span-5 col-start-5",
    secondary: "col-span-3 row-span-3 col-start-5 row-start-6",
    accent: "col-span-2 row-span-3 col-start-3 row-start-6",
    text: "row-span-3 col-span-2 col-start-1 row-start-6",
  };

  const adjustForContrast = (backgroundHex: string) => {
    backgroundHex = backgroundHex.replace(/^#/, "");
    const amount: number = 40;
    let r = parseInt(backgroundHex.substring(0, 2), 16);
    let g = parseInt(backgroundHex.substring(2, 4), 16);
    let b = parseInt(backgroundHex.substring(4, 6), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    const adjustment = luminance > 180 ? -amount : amount;

    r = Math.min(255, Math.max(0, r + adjustment));
    g = Math.min(255, Math.max(0, g + adjustment));
    b = Math.min(255, Math.max(0, b + adjustment));

    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };
  const contrastedBackgroundColor = adjustForContrast(hex);

  if (!palette) throw new Error("The palette was not defined");
  const regenOne = async (role: keyof typeof palette.colors) => {
    if (!palette || !palette.colors || !(role in palette.colors)) return;

    try {
      setIsRegen(true);
      const response = await fetch("/api/oneChange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorToChange: palette.colors?.[role],
          fullPalette: palette.colors,
        }),
      });

      if (!response.ok) throw new Error("Failed to regenerate the color");

      const { hex: newHex } = await response.json();

      setPalette((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          reasoning: prev.reasoning || "",
          colors: {
            ...prev.colors,
            [role]: newHex,
          },
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegen(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopy(true);
      setTimeout(() => setCopy(false), 400);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLock = () => {
    setLockedHexes((prev) => {
      return prev.includes(hex)
        ? prev.filter((color) => color !== hex)
        : [...prev, hex];
    });
    setLocked(!locked);
  };

  const handleRegen = (role: keyof typeof palette.colors) => {
    if (!palette || !palette.colors[role]) return;

    regenOne(role);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-md p-2 ${roleStyles[role]}`}
      style={{ backgroundColor: hex }}
    >
      {isRegen || (!locked && isRegenerating) ? (
        <div className="w-full h-full animate-pulse bg-white/40 rounded-md border-slate-800 flex items-center justify-center">
          <LuLoader className="animate-spin text-4xl text-slate-600 absolute" />
        </div>
      ) : (
        <>
          <p
            style={{ color: contrastedBackgroundColor }}
            className={`absolute top-0 pt-2 text-2xl rounded font-semibold text-slate-600`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </p>

          <div className="flex gap-1 mt-2">
            <button
              className={`p-1 rounded-lg transition ${
                copy ? "bg-white" : "bg-black/20 hover:bg-black/40"
              }`}
              onClick={handleCopy}
            >
              {copy ? <LuCopyCheck className="text-green-600" /> : <LuCopy />}
            </button>
            <button
              className="p-1 rounded-lg bg-black/20 hover:bg-black/40 transition"
              onClick={handleLock}
            >
              {locked ? <LuLock className="text-green-500" /> : <LuLockOpen />}
            </button>
            <button
              className={`p-1 rounded-lg ${
                locked
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black/20 hover:bg-black/40"
              } transition`}
              onClick={!locked ? () => handleRegen(role) : undefined}
              disabled={locked}
            >
              {locked ? <LuLock /> : <LuRepeat2 />}
            </button>
          </div>
          <p 
          style={{ color: contrastedBackgroundColor }}
          className=" px-2 py-1 rounded text-xl font-semibold ">
            {hex}
          </p>
        </>
      )}
    </div>
  );
}
