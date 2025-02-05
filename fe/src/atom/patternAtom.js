import { atom } from "jotai";

export const patternAtom = atom({
  x: 3,
  y: 3,
  coords: [[1, 1]],
});

export const cursorAtom = atom((get) => {
  const pattern = get(patternAtom);

  let shift = pattern.coords[0];

  return pattern.coords.map((coords) => [
    coords[0] - shift[0],
    coords[1] - shift[1],
  ]);
});
