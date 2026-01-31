import { readdir, readFileSync, unlinkSync } from "node:fs";
import {
  chooseOption,
  handleUpdateOptionsMenu,
  MENU_STATE,
} from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../navigate";
import { makeQuestion } from "../../core/input/question";

let selectedOption = 1;

export const showRemoveForm = () => {
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
      action: handleDeleteForm(file),
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

const handleDeleteForm =
  ({ filename, title }: { filename: string; title: string }) =>
  () => {
    clearScreen();

    const logFilePath = `./forms/${filename}`;
    process.stdin.setRawMode(false);

    const question = `Are you sure you want to delete ${COLORS.MAGENTA}${title}${COLORS.RESET}?`;

    makeQuestion(
      `${COLORS.CYAN}${COLORS.BOLD}${question}${COLORS.RESET}${COLORS.DIM} This action cannot be undone. (y/n)${COLORS.RESET}\n`,
      (answer: string) => {
        if (answer.toLowerCase() === "y") {
          try {
            unlinkSync(logFilePath);
            process.stdout.write(
              `${COLORS.GREEN}Form deleted successfully.${COLORS.RESET}\n`,
            );
          } catch {
            process.stdout.write(
              `${COLORS.RED}Error deleting form.${COLORS.RESET}\n`,
            );
          }

          setTimeout(() => {
            navigateToMenu(MENU_STATE.MAIN);
          }, 2000);
        } else {
          navigateToMenu(MENU_STATE.MAIN);
        }
      },
    );
  };
