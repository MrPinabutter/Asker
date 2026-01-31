import { readdir, readFileSync } from "node:fs";
import {
  chooseOption,
  handleUpdateOptionsMenu,
  MENU_STATE,
} from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../navigate";
import { getTimestamp } from "../../utils/date";
import { getFileInfo } from "../../utils/files";
import { makeQuestion } from "../../core/input/question";

let selectedOption = 1;

export const showMenuAnswerForm = () => {
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
      action: handleSelectForm(file),
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

    process.stdin.on("data", handleUpdateOptionsMenu(options, selectedOption));
  });
};

const handleSelectForm =
  ({ filename, title }: { filename: string; title: string }) =>
  () => {
    clearScreen();
    const fileInfo = getFileInfo(filename);

    if (fileInfo.questions.length === 0) {
      process.stdout.write(
        `${COLORS.YELLOW}This form has no questions. Returning to main menu...${COLORS.RESET}\n`,
      );

      setTimeout(() => {
        navigateToMenu(MENU_STATE.MAIN);
      }, 2000);
      return;
    }

    const timestamp = getTimestamp();
    const answersSuffix = `_${timestamp}_answers.txt`;
    const logFilePath = `./answers/${title
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll(/[^a-z0-9_]/g, "")}${answersSuffix}`;

    try {
      readFileSync(logFilePath);
    } catch {
      require("node:fs").writeFileSync(
        logFilePath,
        `[${filename.replace(".txt", "")}] - ${title}\n\n`,
        { flag: "w" },
      );
    }

    renderQuestions({
      questions: fileInfo.questions,
      logFilePath,
    });
  };

const renderQuestions = ({
  questions,
  logFilePath,
  index = 0,
}: {
  questions: string[];
  index?: number;
  logFilePath: string;
}) => {
  if (index >= questions.length) {
    handleFinishForm(logFilePath);
    return;
  }

  const question = questions[index];

  const handleRenderQuestion = (answer: string) => {
    process.stdout.write("\n");
    saveAnswer(question as string, answer, logFilePath);
    renderQuestions({ questions, index: index + 1, logFilePath });
  };

  makeQuestion(
    `${COLORS.CYAN}${COLORS.BOLD}Q${index + 1}: ${question}${COLORS.RESET}\n`,
    handleRenderQuestion,
  );
};

const saveAnswer = (question: string, answer: string, logFilePath: string) => {
  const logEntry = `Q: ${question}\nA: ${answer}\n\n`;
  require("node:fs").appendFileSync(logFilePath, logEntry);
};

const handleFinishForm = (logFilePath: string) => {
  process.stdout.write(
    `${COLORS.GREEN}You have completed the form. The file has been saved as ${logFilePath}${COLORS.RESET}\n`,
  );

  process.stdout.write(
    `${COLORS.YELLOW}Press any key to return to the main menu...${COLORS.RESET}\n`,
  );

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", () => {
    process.stdin.removeAllListeners("data");
    navigateToMenu(MENU_STATE.MAIN);
  });
};
