import { MENU_STATE } from "../core/input/menu";
import { hideCursor } from "../core/terminal/cursor";
import { setMenuState } from "../state";

const menuLoaders = {
  [MENU_STATE.MAIN]: () =>
    import("../menus/start").then((mod) => mod.showMenuStart()),
  [MENU_STATE.SELECT_FORM]: () =>
    import("../menus/answerForm").then((mod) => mod.showMenuAnswerForm()),
  [MENU_STATE.CREATE_FORM]: () =>
    import("../menus/createForm").then((mod) => mod.showMenuCreateForm()),
  [MENU_STATE.LOOK_ANSWERS]: () =>
    import("../menus/lookAnswers").then((mod) => mod.showMenuLookAnswers()),
  [MENU_STATE.REMOVE_FORM]: () =>
    import("../menus/removeForm").then((mod) => mod.showRemoveForm()),
} as const;

export const navigateToMenu = (menu: MENU_STATE) => {
  setMenuState(menu);
  hideCursor();
  menuLoaders[menu]();
};
