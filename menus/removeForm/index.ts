import {
  chooseOption,
  handleUpdateOptionsMenu,
  MENU_STATE,
} from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../navigate";
import { makeQuestion } from "../../core/input/question";
import { renderColor } from "../../core/input/text";
import { FormService } from "../../services/form";

let selectedOption = 1;

export const showRemoveForm = () => {
  clearScreen();
  const files = FormService.getAll();

  if (files.length === 0) {
    process.stdout.write(
      `${COLORS.YELLOW}No forms available. Returning to main menu...${COLORS.RESET}\n`,
    );

    setTimeout(() => {
      navigateToMenu(MENU_STATE.MAIN);
    }, 2000);
    return;
  }

  const options = files.map((file, index) => ({
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
};

const handleDeleteForm =
  ({ filename, title }: { filename: string; title: string }) =>
  () => {
    clearScreen();
    process.stdin.setRawMode(false);

    const question = `Are you sure you want to delete ${renderColor(title, COLORS.MAGENTA)}?`;

    makeQuestion(
      `${renderColor(question, [COLORS.CYAN, COLORS.BOLD])}${renderColor(" This action cannot be undone. (y/n)", COLORS.DIM)}\n`,
      (answer: string) => {
        if (answer.toLowerCase() === "y") {
          try {
            FormService.delete(filename);
            process.stdout.write(
              `${renderColor("Form deleted successfully.", COLORS.GREEN)}\n`,
            );
          } catch {
            process.stdout.write(
              `${renderColor("Error deleting form.", COLORS.RED)}\n`,
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
