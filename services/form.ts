import {
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
  unlinkSync,
} from "node:fs";

interface FormFile {
  filename: string;
  title: string;
}

const FORM_DIR = "./forms";

export const FormService = {
  getAll: () => {
    const files = readdirSync(FORM_DIR);

    return files
      .map((filename) => {
        const content = readFileSync(`${FORM_DIR}/${filename}`, "utf-8");
        const title = content.split("\n")[0];
        return { filename, title: title || "Untitled Form" };
      })
      .toSorted((a, b) => a?.title.localeCompare(b?.title)) as FormFile[];
  },
  getByFilename: (filename: string) => {
    const content = readFileSync(`${FORM_DIR}/${filename}`, "utf-8");
    const lines = content.split("\n");
    const title = lines[0] || "Untitled Form";
    const questions = lines.slice(1).filter((line) => line.trim() !== "");
    return { title, questions };
  },
  create: (title: string, timestamp: string) => {
    writeFileSync(`${FORM_DIR}/${timestamp}.txt`, title.trim() + "\n");
  },
  addQuestion: (filename: string, question: string) => {
    appendFileSync(`${FORM_DIR}/${filename}.txt`, question.trim() + "\n");
  },
  delete: (filename: string) => {
    unlinkSync(`${FORM_DIR}/${filename}`);
  },
};
