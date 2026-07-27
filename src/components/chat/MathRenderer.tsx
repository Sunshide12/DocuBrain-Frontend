"use client";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MathRendererProps {
  content: string;
}

export function MathRenderer({ content }: MathRendererProps) {
  return <MarkdownRenderer content={content} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} />;
}
