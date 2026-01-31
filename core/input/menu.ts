import { COLORS } from "../terminal/colors";
import { showCursor } from "../terminal/cursor";
import { clearScreen } from "../terminal/screen";
import { KeyCode } from "./keycodes";
import { renderColor } from "./text";

export enum MENU_STATE {
  MAIN = 1,
  SELECT_FORM,
  CREATE_FORM,
  LOOK_ANSWERS,
  REMOVE_FORM,
}

export const chooseOption = (
  selected: number,
  options: { id: number; label: string; isGoBack?: boolean }[],
  props?: { title: string },
) => {
  const title = props?.title ?? "Select an option:";

  process.stdout.write(
    `${renderColor(title, [COLORS.CYAN, COLORS.BOLD])} ${renderColor(
      "(use arrow keys, press Enter to confirm)",
      COLORS.DIM,
    )}\n\n`,
  );

  options.forEach((option) => {
    if (option.isGoBack) {
      renderIsGoBackOption(option.label, option.id === selected);
      return;
    }

    if (option.id === selected) {
      process.stdout.write(
        `${renderColor(" ▶ " + option.label, [COLORS.BG_GREEN, COLORS.BLACK, COLORS.BOLD])}\n`,
      );
    } else {
      process.stdout.write(
        renderColor("   " + option.label, COLORS.DIM) + "\n",
      );
    }
  });
};

export const handleUpdateOptionsMenu =
  (
    options: { id: number; label: string; action: () => void }[],
    selectedOption: number,
  ) =>
  (key: Buffer) => {
    if (key[2] === KeyCode.DOWN_ARROW) {
      if (selectedOption < options.length) {
        selectedOption++;
        clearScreen();
        chooseOption(selectedOption, options);
      }
    } else if (key[2] === KeyCode.UP_ARROW) {
      if (selectedOption > 1) {
        selectedOption--;
        clearScreen();
        chooseOption(selectedOption, options);
      }
    } else if (key[0] === KeyCode.ENTER) {
      clearScreen();
      process.stdin.removeAllListeners("data");

      options.find((option) => option.id === selectedOption)?.action();
    } else if (key[0] === KeyCode.CTRL_C) {
      showCursor();
      clearScreen();
      process.exit();
    }
  };

const renderIsGoBackOption = (label: string, isSelected: boolean) => {
  if (isSelected) {
    process.stdout.write(
      `${renderColor(" ← " + label, [COLORS.BG_RED, COLORS.BOLD])}${COLORS.RESET}\n`,
    );
    return;
  }

  process.stdout.write(
    `${renderColor(" ← " + label, COLORS.RED)}${COLORS.RESET}\n`,
  );
};
