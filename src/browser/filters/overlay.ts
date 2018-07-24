import Filter from '../Filter';

const overlay: Filter = (inputs, args) => {
  const x = +(args.x || 0);
  const y = +(args.y || 0);
  return [
    {
      ...inputs[0],
      getFrame(time) {
        const frame = inputs[0].getFrame(time);
        const overlay = inputs[1].getFrame(time);
        frame.ctx.drawImage(overlay.canvas, x, y);
        return frame;
      },
    },
  ];
};

export default overlay;
