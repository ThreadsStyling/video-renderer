import Filter from '../Filter';

const overlay: Filter = (inputs, args) => {
  const x = +(args.x || 0);
  const y = +(args.y || 0);
  const start = +args.start;
  const end = +args.end;
  const duration = end - start;
  return [
    {
      ...inputs[0],
      duration,
      getFrame(time) {
        return inputs[0].getFrame(time + start);
      },
    },
  ];
};

export default overlay;
