import { writeFile, appendFile } from "node:fs";
import { MENU_STATE } from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { showCursor } from "../../core/terminal/cursor";
import { clearScreen, printSeparator } from "../../core/terminal/screen";
import { createInterface } from "node:readline";
import { navigateToMenu } from "../../navigate";
import { getTimestamp } from "../../utils/date";

export const showMenuCreateForm = () => {
  clearScreen();
  showCursor();
  process.stdin.setRawMode(false);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Type a title to your form:${COLORS.RESET} ${COLORS.DIM}(empty to cancel)${COLORS.RESET}\n\n`,
  );

  rl.question("> ", (answer) => {
    rl.close();
    if (!answer) {
      navigateToMenu(MENU_STATE.MAIN);
      return;
    }

    const timestamp = getTimestamp();

    writeFile(`./forms/${timestamp}.txt`, answer.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
    });

    clearScreen();

    const message = ` ${COLORS.BOLD}"${answer.trim()}"${COLORS.RESET}`;
    process.stdout.write(`\n${message}${COLORS.RESET}\n`);

    printSeparator();
    addQuestionToForm(answer.trim(), timestamp);
  });
};

const addQuestionToForm = (
  formTitle: string,
  timestamp: string,
  question: number = 1,
) => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Question ${question}:${COLORS.RESET} ${COLORS.DIM}(empty to finish)${COLORS.RESET}\n\n`,
  );
  rl.question("> ", (answer) => {
    rl.close();
    if (!answer) {
      navigateToMenu(MENU_STATE.MAIN);
      return;
    }

    appendFile(`./forms/${timestamp}.txt`, answer.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
      process.stdout.write(`\n`);
      addQuestionToForm(formTitle, timestamp, question + 1);
    });
  });
};
