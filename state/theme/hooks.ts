import { useAtom } from "jotai";
import { colorModeAtom } from "./atoms";

export const useColorMode = () => {
  const [colorMode, toggleColorMode] = useAtom(colorModeAtom);
  return { colorMode, toggleColorMode };
};
