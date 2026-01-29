import { MENU_STATE } from "../../core/input/menu";
import { navigateToMenu } from "../../navigate";

export const menuStartOptions = [
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
      setTimeout(() => {
        navigateToMenu(MENU_STATE.LOOK_ANSWERS);
      }, 2000);
    },
  },
];
