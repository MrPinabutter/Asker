import { createInterface } from "node:readline";
import {
  hideCursor,
  clearScreen,
  chooseOption,
  KeyCode,
  getTimestamp,
  COLORS,
  showCursor,
} from "./utils";
import { writeFile, appendFile } from "node:fs";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

enum MENU_STATE {
  MAIN = 1,
  SELECT_FORM,
  CREATE_FORM,
  LOOK_ANSWERS,
}

let optionSelected = 1;
let currentMenu = MENU_STATE.MAIN;

const menuStartOptions = [
  {
    id: 1,
    label: "Start form",
    action: () => {
      currentMenu = MENU_STATE.SELECT_FORM;
    },
  },
  {
    id: 2,
    label: "Create form",
    action: () => {
      currentMenu = MENU_STATE.CREATE_FORM;
    },
  },
  {
    id: 3,
    label: "Look answers",
    action: () => {
      currentMenu = MENU_STATE.LOOK_ANSWERS;
    },
  },
];

const showMenuStart = () => {
  clearScreen();
  hideCursor();
  chooseOption(optionSelected, menuStartOptions);

  const handleKey = (key: Buffer) => {
    if (key[2] === KeyCode.DOWN_ARROW) {
      if (optionSelected < menuStartOptions.length) {
        optionSelected++;
        clearScreen();
        chooseOption(optionSelected, menuStartOptions);
      }
    } else if (key[2] === KeyCode.UP_ARROW) {
      if (optionSelected > 1) {
        optionSelected--;
        clearScreen();
        chooseOption(optionSelected, menuStartOptions);
      }
    } else if (key[0] === KeyCode.ENTER) {
      clearScreen();
      menuStartOptions.find((option) => option.id === optionSelected)?.action();
      process.stdin.removeListener("data", handleKey);
      readPropmt();
    } else {
      clearScreen();
      chooseOption(optionSelected, menuStartOptions);
    }
  };
  process.stdin.on("data", handleKey);
};

const showMenuSelectForm = () => {
  clearScreen();
  chooseOption(optionSelected, menuStartOptions);

  process.stdin.on("data", (key) => {
    if (key[2] === KeyCode.DOWN_ARROW) {
      if (optionSelected < menuStartOptions.length) {
        optionSelected++;
        clearScreen();
        chooseOption(optionSelected, menuStartOptions);
      }
    } else if (key[2] === KeyCode.UP_ARROW) {
      if (optionSelected > 1) {
        optionSelected--;
        clearScreen();
        chooseOption(optionSelected, menuStartOptions);
      }
    } else {
      clearScreen();
      chooseOption(optionSelected, menuStartOptions);
    }
  });
};

const showMenuCreateForm = () => {
  clearScreen();
  showCursor();

  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Type a title to your form:${COLORS.RESET} ${COLORS.DIM}(empty to cancel)${COLORS.RESET}\n\n`,
  );

  rl.question("> ", (answer) => {
    if (!answer) {
      rl.close();
      currentMenu = MENU_STATE.MAIN;
      readPropmt();
      return;
    }

    const timestamp = getTimestamp();

    writeFile(`./forms/${timestamp}.txt`, answer + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
    });
    addQuestionToForm(answer, timestamp);
  });
};

const addQuestionToForm = (formTitle: string, timestamp: string) => {
  process.stdout.write(
    `${COLORS.CYAN}${COLORS.BOLD}Now add a question to your form:${COLORS.RESET} ${COLORS.DIM}(empty to finish)${COLORS.RESET}\n\n`,
  );

  rl.question("> ", (answer) => {
    if (!answer) {
      rl.close();
      currentMenu = MENU_STATE.MAIN;
      readPropmt();
      return;
    }

    appendFile(`./forms/${timestamp}.txt`, answer + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
      addQuestionToForm(formTitle, timestamp);
    });
  });
};

const readPropmt = () => {
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

readPropmt();
