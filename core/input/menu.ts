import { COLORS } from "../terminal/colors";
import { showCursor } from "../terminal/cursor";
import { clearScreen } from "../terminal/screen";
import { KeyCode } from "./keycodes";

export enum MENU_STATE {
  MAIN = 1,
  SELECT_FORM,
  CREATE_FORM,
  LOOK_ANSWERS,
}

export const chooseOption = (
  selected: number,
  options: { id: number; label: string; isGoBack?: boolean }[],
  props?: { title: string },
) => {
  const title = props?.title ?? "Select an option:";

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}${title}${COLORS.RESET} ${COLORS.DIM}(use arrow keys, press Enter to confirm)${COLORS.RESET}\n\n`,
  );

  options.forEach((option) => {
    if (option.isGoBack) {
      renderIsGoBackOption(option.label, option.id === selected);
      return;
    }

    if (option.id === selected) {
      process.stdout.write(
        `${COLORS.BG_GREEN}${COLORS.BLACK}${COLORS.BOLD} ▶ ${option.label}${COLORS.RESET}\n`,
      );
    } else {
      process.stdout.write(`${COLORS.DIM}   ${option.label}${COLORS.RESET}\n`);
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
    } else if (key[0] === KeyCode.ESC || key[0] === KeyCode.CTRL_C) {
      showCursor();
      clearScreen();
      process.exit();
    }
  };

const renderIsGoBackOption = (label: string, isSelected: boolean) => {
  if (isSelected) {
    process.stdout.write(
      `${COLORS.BG_RED}${COLORS.BOLD} ← ${label}${COLORS.RESET}\n`,
    );
    return;
  }

  process.stdout.write(`${COLORS.RED} ← ${label}${COLORS.RESET}\n`);
};
