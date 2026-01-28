import { readdir, readFileSync } from "node:fs";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../main";
import {
  chooseOption,
  handleUpdateOptionsMenu,
  MENU_STATE,
} from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { getFileInfo } from "../../utils/files";
import { showCursor } from "../../core/terminal/cursor";
import { createInterface } from "node:readline";

let selectedOption = 1;

export const showMenuAnswerForm = () => {
  clearScreen();
  readdir("./forms", (err, files) => {
    if (err) {
      console.error("Error reading forms directory:", err);
      navigateToMenu(MENU_STATE.MAIN);
      return;
    }

    if (files.length === 0) {
      process.stdout.write(
        `${COLORS.YELLOW}No forms available. Returning to main menu...${COLORS.RESET}\n`,
      );

      setTimeout(() => {
        navigateToMenu(MENU_STATE.MAIN);
      }, 2000);
      return;
    }

    const titleFiles = files
      .map((filename) => {
        const content = readFileSync(`./forms/${filename}`, "utf-8");
        const title = content.split("\n")[0];
        return { filename, title: title || "Untitled Form" };
      })
      .toSorted((a, b) => a?.title.localeCompare(b?.title));

    const options = titleFiles.map((file, index) => ({
      id: index + 2,
      label: file.title,
      action: () => {
        clearScreen();
        const fileInfo = getFileInfo(file.filename);

        if (fileInfo.questions.length === 0) {
          process.stdout.write(
            `${COLORS.YELLOW}This form has no questions. Returning to main menu...${COLORS.RESET}\n`,
          );

          setTimeout(() => {
            navigateToMenu(MENU_STATE.MAIN);
          }, 2000);
          return;
        }

        renderQuestions(fileInfo.questions);
      },
    })) as {
      id: number;
      label: string;
      action: () => void;
      isGoBack?: boolean;
    }[];

    options.unshift({
      id: 1,
      label: "Go back",
      action: () => {
        navigateToMenu(MENU_STATE.MAIN);
      },
      isGoBack: true,
    });

    chooseOption(selectedOption, options);

    process.stdin.on("data", handleUpdateOptionsMenu(options, selectedOption));
  });
};

const renderQuestions = (questions: string[], index: number = 0) => {
  if (index >= questions.length) {
    navigateToMenu(MENU_STATE.MAIN);
    return;
  }

  showCursor();
  process.stdin.setRawMode(false);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Q${index + 1}: ${questions[index]}${COLORS.RESET}\n`,
  );

  rl.question("> ", (answer) => {
    rl.close();
    process.stdout.write("\n");
    renderQuestions(questions, index + 1);
  });
};
