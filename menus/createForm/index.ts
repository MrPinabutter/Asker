import { writeFile, appendFile } from "node:fs";
import { MENU_STATE } from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen, printSeparator } from "../../core/terminal/screen";
import { navigateToMenu } from "../../navigate";
import { getTimestamp } from "../../utils/date";
import { makeQuestion } from "../../core/input/question";
import { renderColor } from "../../core/input/text";

const handleGetTitleForm = (formTitle: string) => {
  if (!formTitle) {
    navigateToMenu(MENU_STATE.MAIN);
    return;
  }

  const timestamp = getTimestamp();

  writeFile(`./forms/${timestamp}.txt`, formTitle.trim() + "\n", (err) => {
    if (err) {
      console.error("Error creating form:", err);
    }
  });

  clearScreen();

  const message = ` ${renderColor(formTitle.trim(), [COLORS.BOLD])}`;
  process.stdout.write(`\n${message}${COLORS.RESET}\n`);

  printSeparator();
  addQuestionToForm(formTitle.trim(), timestamp);
};

export const showMenuCreateForm = () => {
  clearScreen();
  makeQuestion(
    `${renderColor("Type a title to your form:", [COLORS.CYAN, COLORS.BOLD])} ${renderColor("(empty to cancel)", COLORS.DIM)}\n\n`,
    handleGetTitleForm,
  );
};

const handleGetQuestionForm =
  (formTitle: string, timestamp: string, index: number = 1) =>
  (question: string) => {
    if (!question) {
      navigateToMenu(MENU_STATE.MAIN);
      return;
    }

    appendFile(`./forms/${timestamp}.txt`, question.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
      process.stdout.write(`\n`);
      addQuestionToForm(formTitle, timestamp, index + 1);
    });
  };

const addQuestionToForm = (
  formTitle: string,
  timestamp: string,
  index: number = 1,
) => {
  makeQuestion(
    renderColor(`Question ${index}:`, [COLORS.CYAN, COLORS.BOLD]) +
      " " +
      renderColor("(empty to finish)", COLORS.DIM) +
      "\n\n",
    handleGetQuestionForm(formTitle, timestamp, index),
  );
};
