interface TextParams {
  text: string;
  fontsize: number;
  font: string;
}

// Always reuse the same canvas as it is not returned.
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const measureText = ({text, font, fontsize}: TextParams) => {
  const fontStyle = `${fontsize}px ${font}`;

  // Measure text width.
  context.font = fontStyle;
  const tw = context.measureText(text).width;

  // Measure text height.
  canvas.width = fontsize * 2 * text.length;
  canvas.height = fontsize * 2;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.textBaseline = 'top';
  context.fillStyle = 'white';
  context.font = fontStyle;
  context.fillText(text, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let start = -1;
  let end = -1;

  // iterate the rows
  for (let row = 0; row < canvas.height; row++) {
    // iterate the columns
    for (let column = 0; column < canvas.width; column++) {
      // get alpha value for this pixel
      const index = (row * canvas.width + column) * 4;

      // found a black pixel
      if (pixels[index] === 0) {
        // we are at the end of an all black row and start has been found
        if (column === canvas.width - 1 && start !== -1) {
          // set the end, but only if we haven't got one already
          if (end === -1) end = row;

          // exit inner loop
          break;
        }

        // continue searching this row
        continue;
      } else {
        // we found a non black pixel
        // and we haven't found the start yet
        if (start === -1) {
          // we found the start row
          start = row;
        }

        // if we hit non-black after starting, we must look for a new end
        end = -1;

        // don't check the rest of this row
        break;
      }
    }
  }
  const th = end - start;

  return {
    th,
    tw,
    end,
    start,
  };
};

export default measureText;
