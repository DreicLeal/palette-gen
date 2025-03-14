"use client";
import { useColors } from "@/context/colorsContext";
import ColorCard from "./ColorCard";

export default function Colors() {
  const { palette, loading, regenColorsRequest, lockedHexes } = useColors();

  return (
<>
{loading? (
 <ul className="sm:flex w-full mx-auto gap-1 justify-between">
 {["######", "######", "######", "######", "######"].map(
   (hex, index) => (
     <li
       className="flex sm:flex-col w-[100%] sm:w-[150px] mb-1 h-[60px] sm:h-[300px] rounded-b-md border-2 animate-pulse bg-white/40 border-slate-800"
       key={index}
     >
       <div>
         <p className="bg-white text-center font-semibold rounded-br-md sm:rounded-none text-slate-600 px-1">
           {hex}
         </p>
       </div>
     </li>
   )
 )}
</ul>
):(

    <div className="">
      {palette && palette.hexes?.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <ul className=" sm:flex w-full mx-auto gap-1 justify-between">
            {palette.hexes.map((hex) => (
              <ColorCard key={hex} hex={hex} />
            ))}
          </ul>
          <button
            onClick={regenColorsRequest}
            className="p-2 rounded-md text-slate-600 bg-slate-200 font-semibold"
          >
            {lockedHexes.length === palette.hexes.length? "Deve haver pelo menos uma cor desbloqueada.":"Gerar novamente"}
          </button>
        </div>
      ) : (
        <div className="w-full">
          <ul className="sm:flex w-full mx-auto gap-1 justify-between">
            {["######", "######", "######", "######", "######"].map(
              (hex, index) => (
                <li
                  className="flex sm:flex-col w-[100%] mb-1 sm:w-[150px] h-[60px] sm:h-[300px] rounded-b-md border-2 bg-white/40 border-slate-800"
                  key={index}
                >
                  <div>
                    <p className="bg-white text-center font-semibold rounded-br-md sm:rounded-none text-slate-600 px-1">
                      {hex}
                    </p>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
)}
</>
  );
}
