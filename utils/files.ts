import { readFileSync } from "node:fs";

export const getFileInfo = (filename: string) => {
  const content = readFileSync(`./forms/${filename}`, "utf-8");
  const lines = content.split("\n");
  const title = lines[0] || "Untitled Form";
  const questions = lines.slice(1).filter((line) => line.trim() !== "");
  return { title, questions };
};
