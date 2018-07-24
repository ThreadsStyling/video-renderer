import Filter from '../Filter';

const overlay: Filter = (inputs) => {
  return [
    {
      ...inputs[0],
      getFrame(time) {
        const frame = inputs[0].getFrame(time);
        const overlay = inputs[1].getFrame(time);
        frame.ctx.drawImage(overlay.canvas, 0, 0);
        return frame;
      },
    },
  ];
};

export default overlay;
