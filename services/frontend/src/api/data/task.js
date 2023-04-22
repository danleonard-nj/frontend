import { defaultTask } from '../helpers/taskHelpers';

const taskState = {
  clients: [],
  tasks: [],
  task: defaultTask,
  taskLoading: false,
  tasksLoading: false,
  clientsLoading: true,
  isNew: false,
};

export { taskState };
