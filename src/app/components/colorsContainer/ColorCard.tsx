"use client";
import {
  LuCopy,
  LuCopyCheck,
  LuLockOpen,
  LuLock,
  LuRepeat2,
} from "react-icons/lu";
import { useState } from "react";
import { useColors } from "@/context/colorsContext";

export default function ColorCard({ hex }: { hex: string }) {
  const {  setLockedHexes, setPalette, palette, lockedHexes, isRegenerating} =
    useColors();
  const [copy, setCopy] = useState(false);
  const [isRegen, setIsRegen] = useState(false);
  const [locked, setLocked] = useState(false);

  const regenOne = async (keep: string[], change: string) => {
    if (!palette?.hexes) return;
    const index = palette.hexes.lastIndexOf(change);
    if (index === -1) return;
    try {
      setIsRegen(true);
      const response = await fetch("/api/oneChange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colors: keep, colorToChange: change }),
      });
      if (!response) throw new Error("Failed to regenerate the colors");
      const { hex } = await response.json();
      const newHexes = [...palette.hexes];
      newHexes[index] = hex;
      setPalette((prev) => ({
        ...prev,
        reasoning: prev?.reasoning ?? "",
        hexes: newHexes,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegen(false);
    }
  };

  const handleCopy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopy(true);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setCopy(false), 400);
    }
  };

  const handleLock = async (hex: string) => {
    setLockedHexes((prev) => {
      return prev.includes(hex)
        ? prev.filter((color) => color !== hex)
        : [...prev, hex];
    });
    setLocked((prev) => !prev);
  };
  const handleRegen = async (hex: string) => {
    if (!palette?.hexes) return;
    const colorsToKeep = palette?.hexes.filter((color) => color !== hex);
    regenOne(colorsToKeep, hex);
  };

  return (
    <>
      {isRegen || (!lockedHexes && isRegenerating)? (
             <li
             className="relative flex sm:flex-col w-[100%] sm:w-[150px] mb-1 h-[60px] sm:h-[300px] rounded-b-md border-2 animate-pulse bg-white/40 border-slate-800"
           >
             <div>
               <p className="bg-white border-1 px-1 rounded-br-md sm:rounded-none w-fit h-fit sm:w-full sm:absolute text-center text-xs font-semibold text-slate-600">
                 {hex}
               </p>
             </div>
           </li>
      ) : (
        <li
          style={{ backgroundColor: hex }}
          className="relative flex sm:flex-col mb-1 w-[100%] sm:w-[150px] h-[60px] sm:h-[300px] rounded-b-md border-2 border-slate-800"
        >
          <p className="bg-white border-1 px-1 rounded-br-md sm:rounded-none w-fit h-fit sm:w-full sm:absolute text-center text-xs font-semibold text-slate-600">
            {hex}
          </p>
          <div className="p-2 flex sm:flex-col h-[100%] w-full items-center justify-center gap-2">
            <button
              className={` ${copy?"bg-white":"bg-black/20"} hover:bg-black/40 transition duration-300  p-1 rounded-lg`}
              onClick={() => handleCopy(hex)}
            >
              {copy ? <LuCopyCheck className="text-green-600" /> : <LuCopy />}
            </button>
            <button
              className="bg-black/20 p-1 rounded-lg hover:bg-black/40 transition duration-300"
              onClick={() => handleLock(hex)}
            >
              {locked ? <LuLock className="text-green-500" /> : <LuLockOpen />}
            </button>
            <button
              className="bg-black/20 p-1 rounded-lg hover:bg-black/40 transition duration-300"
              onClick={!locked?() => handleRegen(hex):undefined}
            >
              {locked? <LuLock /> : <LuRepeat2 />}
            </button>
          </div>
        </li>
      )}
    </>
  );
}
