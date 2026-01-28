import { chooseOption, handleUpdateOptionsMenu } from "../../core/input/menu";
import { hideCursor } from "../../core/terminal/cursor";
import { clearScreen } from "../../core/terminal/screen";
import { menuStartOptions } from "./config";

let selectedOption = 1;

export const showMenuStart = () => {
  selectedOption = 1;
  clearScreen();
  hideCursor();
  process.stdin.setRawMode(true);
  process.stdin.resume();
  chooseOption(selectedOption, menuStartOptions);
  process.stdin.on(
    "data",
    handleUpdateOptionsMenu(menuStartOptions, selectedOption),
  );
};
