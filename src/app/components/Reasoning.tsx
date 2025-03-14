"use client";
import { useColors } from "@/context/colorsContext";
import ReactMarkdown from "react-markdown";

export default function Reasoning() {
  const { palette } = useColors();
  return <ReactMarkdown>{palette?.reasoning}</ReactMarkdown>;
}
