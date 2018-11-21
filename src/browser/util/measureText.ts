import createCanvasAndContext from './createCanvasAndContext';

interface TextParams {
  text: string;
  fontsize: number;
  font: string;
}

const measureText = ({text, font, fontsize}: TextParams) => {
  const [, textContext, disposeText] = createCanvasAndContext();
  const fontStyle = `${fontsize}px ${font}`;

  // Measure text width.
  textContext.font = fontStyle;
  const tw = textContext.measureText(text).width;

  // Measure text height.
  const [thCanvas, thContext, disposeTh] = createCanvasAndContext();
  thCanvas.width = fontsize * 2 * text.length;
  thCanvas.height = fontsize * 2;
  thContext.fillRect(0, 0, thCanvas.width, thCanvas.height);
  thContext.textBaseline = 'top';
  thContext.fillStyle = 'white';
  thContext.font = fontStyle;
  thContext.fillText(text, 0, 0);
  const pixels = thContext.getImageData(0, 0, thCanvas.width, thCanvas.height).data;
  let start = -1;
  let end = -1;

  // iterate the rows
  for (let row = 0; row < thCanvas.height; row++) {
    // iterate the columns
    for (let column = 0; column < thCanvas.width; column++) {
      // get alpha value for this pixel
      const index = (row * thCanvas.width + column) * 4;

      // found a black pixel
      if (pixels[index] === 0) {
        // we are at the end of an all black row and start has been found
        if (column === thCanvas.width - 1 && start !== -1) {
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

  disposeTh();
  disposeText();

  return {
    th,
    tw,
    end,
    start,
  };
};

export default measureText;
