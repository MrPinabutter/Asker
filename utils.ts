import dayjs from "dayjs";

export const hideCursor = () => {
  process.stdout.write("\x1B[?25l");
};

export const showCursor = () => {
  process.stdout.write("\x1B[?25h");
};

export const clearScreen = () => {
  console.clear();
};

export enum KeyCode {
  ESC = 27,
  BRACKET = 91,
  UP_ARROW = 65,
  DOWN_ARROW = 66,
  ENTER = 13,
  CTRL_C = 3,
}

export const chooseOption = (
  selected: number,
  options: { id: number; label: string }[],
) => {
  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Select an option:${COLORS.RESET} ${COLORS.DIM}(use arrow keys, press Enter to confirm)${COLORS.RESET}\n\n`,
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

export const COLORS = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  DIM: "\x1b[2m",
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  RED: "\x1b[31m",
  BG_CYAN: "\x1b[46m",
  BG_GREEN: "\x1b[42m",
  BLACK: "\x1b[30m",
};

export const getTimestamp = () => {
  return dayjs().format("YYYYMMDDHHmmss");
};
