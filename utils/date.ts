import dayjs from "dayjs";

export const getTimestamp = () => {
  return dayjs().format("YYYYMMDDHHmmss");
};
