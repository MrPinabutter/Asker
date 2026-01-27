import { COLORS } from "../terminal/colors";

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

const renderIsGoBackOption = (label: string, isSelected: boolean) => {
  if (isSelected) {
    process.stdout.write(
      `${COLORS.BG_RED}${COLORS.BOLD} ← ${label}${COLORS.RESET}\n`,
    );
    return;
  }

  process.stdout.write(`${COLORS.RED} ← ${label}${COLORS.RESET}\n`);
};
