import dayjs from "dayjs";
import {
  chooseOption,
  handleUpdateOptionsMenu,
  MENU_STATE,
} from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { readdir, readFileSync } from "node:fs";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../navigate";

const selectedOption = 1;

export const showMenuLookAnswers = () => {
  const answersDir = "./answers";

  readdir(answersDir, (err, files) => {
    if (err) {
      process.stdout.write(
        `${COLORS.RED}Error reading answers directory: ${err.message}${COLORS.RESET}\n`,
      );
      return;
    }

    if (files.length === 0) {
      process.stdout.write(
        `${COLORS.YELLOW}No answers found in the directory.${COLORS.RESET}\n`,
      );

      setTimeout(() => {
        navigateToMenu(MENU_STATE.MAIN);
      }, 2000);

      return;
    }

    const titleFiles = files
      .map((filename) => {
        const content = readFileSync(`./answers/${filename}`, "utf-8");

        const firstLine = content.split("\n")[0];
        const timestamp = firstLine?.[0]?.match(/\[(.*?)\]/)?.[1];

        const result = firstLine?.split(" - ");
        const title = result?.[1];

        const date = dayjs(timestamp).format("DD/MM/YYYY HH:mm");

        return { filename, title: `(${date}) - ${title}` };
      })
      .toSorted((a, b) => a?.title.localeCompare(b?.title));

    const options = titleFiles.map((file, index) => ({
      id: index + 1,
      label: file.title,
      action: () => {
        const content = readFileSync(`./answers/${file.filename}`, "utf-8");
        clearScreen();

        process.stdout.write(`${content}\n`);

        process.stdout.write(
          `\n${COLORS.DIM}Press any key to go back to the answers menu...${COLORS.RESET}\n`,
        );

        process.stdin.removeAllListeners("data");

        process.stdin.setRawMode(true);
        process.stdin.once("data", () => {
          clearScreen();
          showMenuLookAnswers();
        });
      },
    }));

    chooseOption(selectedOption, options);

    process.stdin.on("data", handleUpdateOptionsMenu(options, selectedOption));
  });
};
