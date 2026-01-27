import { appendFile, readdir, readFileSync, writeFile } from "node:fs";
import { createInterface } from "node:readline";
import { KeyCode } from "./core/input/keycodes";
import { chooseOption, MENU_STATE } from "./core/input/menu";
import { COLORS } from "./core/terminal/colors";
import { hideCursor, showCursor } from "./core/terminal/cursor";
import { clearScreen, printSeparator } from "./core/terminal/screen";
import { getTimestamp } from "./utils/date";

let selectedOption = 1;
let currentMenu = MENU_STATE.MAIN;

const navigateToMenu = (menu: MENU_STATE) => {
  currentMenu = menu;
  readPrompt();
};

const menuStartOptions = [
  {
    id: 1,
    label: "Start form",
    action: () => {
      navigateToMenu(MENU_STATE.SELECT_FORM);
    },
  },
  {
    id: 2,
    label: "Create form",
    action: () => {
      navigateToMenu(MENU_STATE.CREATE_FORM);
    },
  },
  {
    id: 3,
    label: "Look answers",
    action: () => {
      clearScreen();
      process.stdout.write(
        `${COLORS.YELLOW}Feature not implemented yet. Returning to main menu...${COLORS.RESET}\n`,
      );

      setTimeout(() => {
        navigateToMenu(MENU_STATE.MAIN);
      }, 2000);
    },
  },
];

const handleUpdateOptionsMenu =
  (options: { id: number; label: string; action: () => void }[]) =>
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

const showMenuStart = () => {
  selectedOption = 1;
  clearScreen();
  hideCursor();
  process.stdin.setRawMode(true);
  process.stdin.resume();
  chooseOption(selectedOption, menuStartOptions);
  process.stdin.on("data", handleUpdateOptionsMenu(menuStartOptions));
};

const showMenuSelectForm = () => {
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
      action: () => {
        clearScreen();
        const fileInfo = getFileInfo(file.filename);

        if (fileInfo.questions.length === 0) {
          process.stdout.write(
            `${COLORS.YELLOW}This form has no questions. Returning to main menu...${COLORS.RESET}\n`,
          );

          setTimeout(() => {
            navigateToMenu(MENU_STATE.MAIN);
          }, 2000);
          return;
        }

        renderQuestions(fileInfo.questions);
      },
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

    process.stdin.on("data", handleUpdateOptionsMenu(options));
  });
};

const renderQuestions = (questions: string[], index: number = 0) => {
  if (index >= questions.length) {
    navigateToMenu(MENU_STATE.MAIN);
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  showCursor();
  process.stdin.setRawMode(false);

  process.stdout.write(
    `${COLORS.BOLD}Q${index + 1}:${COLORS.RESET} ${questions[index]}\n\n`,
  );

  rl.question(
    `${COLORS.CYAN}${COLORS.BOLD}Your answer:${COLORS.RESET}\n\n> `,
    (answer) => {
      rl.close();
      renderQuestions(questions, index + 1);
    },
  );
};

const getFileInfo = (filename: string) => {
  const content = readFileSync(`./forms/${filename}`, "utf-8");
  const lines = content.split("\n");
  const title = lines[0] || "Untitled Form";
  const questions = lines.slice(1).filter((line) => line.trim() !== "");
  return { title, questions };
};

const showMenuCreateForm = () => {
  clearScreen();
  showCursor();
  process.stdin.setRawMode(false);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Type a title to your form:${COLORS.RESET} ${COLORS.DIM}(empty to cancel)${COLORS.RESET}\n\n`,
  );

  rl.question("> ", (answer) => {
    rl.close();
    if (!answer) {
      currentMenu = MENU_STATE.MAIN;
      readPrompt();
      return;
    }

    const timestamp = getTimestamp();

    writeFile(`./forms/${timestamp}.txt`, answer.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
    });

    clearScreen();

    const message = ` ${COLORS.BOLD}"${answer.trim()}"${COLORS.RESET}`;
    process.stdout.write(`\n${message}${COLORS.RESET}\n`);

    printSeparator();
    addQuestionToForm(answer.trim(), timestamp);
  });
};

const addQuestionToForm = (
  formTitle: string,
  timestamp: string,
  question: number = 1,
) => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Question ${question}:${COLORS.RESET} ${COLORS.DIM}(empty to finish)${COLORS.RESET}\n\n`,
  );
  rl.question("> ", (answer) => {
    if (!answer) {
      navigateToMenu(MENU_STATE.MAIN);
      return;
    }

    appendFile(`./forms/${timestamp}.txt`, answer.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
      process.stdout.write(`\n`);
      addQuestionToForm(formTitle, timestamp, question + 1);
    });

    rl.close();
  });
};

const readPrompt = () => {
  hideCursor();
  switch (currentMenu) {
    case MENU_STATE.MAIN:
      showMenuStart();
      break;
    case MENU_STATE.SELECT_FORM:
      showMenuSelectForm();
      break;
    case MENU_STATE.CREATE_FORM:
      showMenuCreateForm();
      break;
  }
};

readPrompt();
