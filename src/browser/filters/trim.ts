import Filter from '../Filter';

const overlay: Filter = (inputs, args) => {
  const start = +args.start;
  const end = +args.end;
  const i = inputs[0];
  if (start === 0) {
    [
      {
        ...i,
        duration: end,
      },
    ];
  }
  return [
    {
      ...i,
      duration: end - start,
      getFrame(time) {
        return i.getFrame(time + start);
      },
    },
  ];
};

export default overlay;
