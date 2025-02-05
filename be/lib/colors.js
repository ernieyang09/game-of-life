function hexToRgb(hex) {
  hex = hex.replace(/^#/, ""); // Remove "#" if present
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join(""); // Convert short hex to full
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function averageColor(colors) {
  const rgbColors = colors.map((color) =>
    typeof color === "string" ? hexToRgb(color) : color
  );

  const total = rgbColors.length;
  const avg = rgbColors.reduce(
    (acc, [r, g, b]) => {
      acc[0] += r;
      acc[1] += g;
      acc[2] += b;
      return acc;
    },
    [0, 0, 0]
  );

  return rgbToHex(avg.map((v) => Math.round(v / total)));
}

function randomColor() {
  // Generate a random hex color
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = { hexToRgb, rgbToHex, averageColor, randomColor };
