import { MENU_STATE } from "../../core/input/menu";
import { COLORS } from "../../core/terminal/colors";
import { navigateToMenu } from "../../navigate";

export const showMenuLookAnswers = () => {
  process.stdout.write(
    `${COLORS.YELLOW}This menu is in development. Returning to main menu...${COLORS.RESET}\n`,
  );

  setTimeout(() => {
    navigateToMenu(MENU_STATE.MAIN);
  }, 2000);
};
