const createInputNode = (id, name) => {
  return {
    id: id,
    type: 'input',
    data: { label: name },
    position: { x: 0, y: 0 },
  };
};

const createOutputNode = (id, name) => {
  return {
    id: id,
    type: 'output',
    data: { label: name },
    position: { x: 250, y: 0 },
  };
};

export { createInputNode, createOutputNode };
