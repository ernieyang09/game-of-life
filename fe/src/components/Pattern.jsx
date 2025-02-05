import cls from "classnames";
import { useSetAtom } from "jotai";
import { patternAtom } from "../atom/patternAtom";

const Pattern = (pattern) => {
  const { x, y, coords } = pattern;
  const setPattern = useSetAtom(patternAtom);
  const coordsMap = coords.reduce((acc, [x, y]) => {
    acc[`${x},${y}`] = true;
    return acc;
  }, {});

  return (
    <div
      className="pattern"
      style={{
        width: `${x * 12 + x - 1}px `,
        gridTemplateColumns: `repeat(${x}, 1fr)`,
        gridTemplateRows: `repeat(${y}, 1fr)`,
      }}
    >
      {[...Array(y)].map((_, i) =>
        [...Array(x)].map((_, j) => {
          return (
            <div
              key={`${i},${j}`}
              className={cls("cell", {
                alive: coordsMap[`${i},${j}`],
              })}
              onClick={() => setPattern(pattern)}
            />
          );
        })
      )}
    </div>
  );
};

export default Pattern;
