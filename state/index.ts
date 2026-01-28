import { MENU_STATE } from "../core/input/menu";

let currentMenu: MENU_STATE = MENU_STATE.MAIN;

export const getMenuState = () => currentMenu;

export const setMenuState = (menu: MENU_STATE) => {
  currentMenu = menu;
};
