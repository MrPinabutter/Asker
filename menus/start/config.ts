import { MENU_STATE } from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { clearScreen } from "../../core/terminal/screen";
import { navigateToMenu } from "../../main";

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
