"use client";
import { useColors } from "@/context/colorsContext";
import Form from "./Form";
import Reasoning from "./Reasoning";

export default function FormReasoning() {
  const { palette, loading } = useColors();
  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="w-[20%] h-[20px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
          <div className="w-full h-[15px] bg-slate-300 animate-pulse rounded-md"></div>
        </div>
      ) : palette ? (
        <Reasoning />
      ) : (
        <Form />
      )}
    </>
  );
}
