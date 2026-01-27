import { COLORS } from "../terminal/colors";

export enum MENU_STATE {
  MAIN = 1,
  SELECT_FORM,
  CREATE_FORM,
  LOOK_ANSWERS,
}

export const chooseOption = (
  selected: number,
  options: { id: number; label: string }[],
  props?: { title: string },
) => {
  const title = props?.title ?? "Select an option:";

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}${title}${COLORS.RESET} ${COLORS.DIM}(use arrow keys, press Enter to confirm)${COLORS.RESET}\n\n`,
  );

  options.forEach((option) => {
    if (option.id === selected) {
      process.stdout.write(
        `${COLORS.BG_GREEN}${COLORS.BLACK}${COLORS.BOLD} ▶ ${option.label}${COLORS.RESET}\n`,
      );
    } else {
      process.stdout.write(`${COLORS.DIM}   ${option.label}${COLORS.RESET}\n`);
    }
  });
};
