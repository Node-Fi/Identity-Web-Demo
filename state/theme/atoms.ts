import { atom } from "jotai";

const colorModeAtomBase = atom<"light" | "dark">("light");

export const colorModeAtom = atom(
  (get) => get(colorModeAtomBase),
  (get, set) => {
    const colorMode = get(colorModeAtomBase);
    set(colorModeAtomBase, colorMode === "light" ? "dark" : "light");
  }
);
