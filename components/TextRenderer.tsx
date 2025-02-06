interface TextItem {
  text: string;
  position: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export const processTextData = (rawText: string): TextItem[] => {
  // Split into lines and remove empty lines
  const lines = rawText.split("\n").filter((line) => line.trim());

  // Process each line
  return lines
    .filter((line) => !line.includes("--- Page"))
    .map((line) => {
      const match = line.match(/(.*?)\s*\(([\d.,\s]+)\)/);
      if (!match) return null;

      const [_, text, coords] = match;
      const [x1, y1, x2, y2] = coords.split(",").map((num) => parseFloat(num));

      return {
        text: text.trim(),
        position: { x1, y1, x2, y2 },
      };
    })
    .filter((item): item is TextItem => item !== null);
};

// Helper function to group text items by lines
export const groupTextByLines = (textItems: TextItem[]): TextItem[][] => {
  const lineThreshold = 5; // Pixels threshold to consider items on the same line

  // Sort by Y position
  const sortedItems = [...textItems].sort(
    (a, b) => a.position.y1 - b.position.y1
  );

  const lines: TextItem[][] = [];
  let currentLine: TextItem[] = [];
  let currentY = sortedItems[0]?.position.y1;

  sortedItems.forEach((item) => {
    if (Math.abs(item.position.y1 - currentY) > lineThreshold) {
      // New line
      if (currentLine.length > 0) {
        lines.push(
          [...currentLine].sort((a, b) => a.position.x1 - b.position.x1)
        );
      }
      currentLine = [item];
      currentY = item.position.y1;
    } else {
      currentLine.push(item);
    }
  });

  // Add the last line
  if (currentLine.length > 0) {
    lines.push([...currentLine].sort((a, b) => a.position.x1 - b.position.x1));
  }

  return lines;
};
