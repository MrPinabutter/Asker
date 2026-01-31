import { COLORS } from "../terminal/colors";

export const renderColor = (text: string, colorCode: string | string[]) => {
  if (Array.isArray(colorCode)) {
    return `${colorCode.join("")}${text}${COLORS.RESET}`;
  }
  return `${colorCode}${text}${COLORS.RESET}`;
};
