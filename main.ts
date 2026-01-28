import { MENU_STATE } from "./core/input/menu";
import { hideCursor } from "./core/terminal/cursor";
import { showMenuStart } from "./menus/start";
import { showMenuAnswerForm } from "./menus/answerForm";
import { showMenuCreateForm } from "./menus/createForm";

let currentMenu = MENU_STATE.MAIN;

export const navigateToMenu = (menu: MENU_STATE) => {
  currentMenu = menu;
  readPrompt();
};

const readPrompt = () => {
  hideCursor();
  switch (currentMenu) {
    case MENU_STATE.MAIN:
      showMenuStart();
      break;
    case MENU_STATE.SELECT_FORM:
      showMenuAnswerForm();
      break;
    case MENU_STATE.CREATE_FORM:
      showMenuCreateForm();
      break;
  }
};

readPrompt();
