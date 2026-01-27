export const clearScreen = () => {
  console.clear();
};

export const printSeparator = () => {
  const width = process.stdout.columns - 2 || 80;

  process.stdout.write("\n " + "─".repeat(width) + "\n\n");
};
