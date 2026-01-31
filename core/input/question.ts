import { showCursor } from "../terminal/cursor";
import { createInterface } from "node:readline";

export const makeQuestion = (
  question: string,
  callback: (answer: string) => void,
) => {
  showCursor();
  process.stdin.setRawMode(false);

  process.stdout.write(question);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("> ", (answer) => {
    rl.close();
    process.stdin.setRawMode(true);
    callback(answer);
  });
};
