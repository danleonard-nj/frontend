const isJsonEditorVisible = (task) =>
  ['POST', 'PUT'].includes(task?.method);

export { isJsonEditorVisible };
