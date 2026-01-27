export const hideCursor = () => {
  process.stdout.write("\x1B[?25l");
};

export const showCursor = () => {
  process.stdout.write("\x1B[?25h");
};
