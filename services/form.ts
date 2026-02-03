import {
  readdir,
  readFileSync,
  writeFile,
  appendFile,
  unlinkSync,
} from "node:fs";

interface FormFile {
  filename: string;
  title: string;
}

const FORM_DIR = "./forms";

export const FormService = {
  getAll: () => {
    let responseFiles: FormFile[] = [];
    readdir(FORM_DIR, (err, files) => {
      if (err) {
        console.error("\n\nError reading forms directory:", err);
        return;
      }

      const filesMapped = files
        .map((filename) => {
          const content = readFileSync(`${FORM_DIR}/${filename}`, "utf-8");
          const title = content.split("\n")[0];
          return { filename, title: title || "Untitled Form" };
        })
        .toSorted((a, b) => a?.title.localeCompare(b?.title));

      responseFiles = filesMapped;
    });

    return responseFiles;
  },
  getByFilename: (filename: string) => {
    const content = readFileSync(`${FORM_DIR}/${filename}`, "utf-8");
    const lines = content.split("\n");
    const title = lines[0] || "Untitled Form";
    const questions = lines.slice(1).filter((line) => line.trim() !== "");
    return { title, questions };
  },
  create: (title: string, timestamp: string) => {
    writeFile(`${FORM_DIR}/${timestamp}.txt`, title.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
    });
  },
  addQuestion: (filename: string, question: string) => {
    appendFile(`${FORM_DIR}/${filename}.txt`, question.trim() + "\n", (err) => {
      if (err) {
        console.error("Error creating form:", err);
      }
    });
  },
  delete: (filename: string) => {
    unlinkSync(`${FORM_DIR}/${filename}.txt`);
  },
};
