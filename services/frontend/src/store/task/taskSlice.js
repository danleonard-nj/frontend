import { createSlice } from '@reduxjs/toolkit';
import { defaultTask } from '../../api/helpers/taskHelpers';

const initialState = {
  clients: [],
  tasks: [],
  task: defaultTask,
  taskLoading: false,
  tasksLoading: false,
  clientsLoading: true,
  isNew: false,
};

const clientReducers = {
  setClient(state, { payload }) {
    state.client = payload;
  },
  setClients(state, { payload }) {
    state.clientsLoading = false;
    state.clients = payload;
  },
  setClientsLoading(state, { payload }) {
    state.clientsLoading = true;
  },
};

const taskReducers = {
  tasksFetching(state) {
    state.tasksLoaded = false;
    state.tasksFetching = true;
  },
  tasksFetched(state, { payload }) {
    state.tasks = payload;
    state.tasksFetching = false;
    state.tasksLoaded = true;
  },

  taskFetching(state) {
    state.taskLoaded = false;
    state.taskFetching = true;
  },
  newTask(state, { payload }) {
    state.isNew = true;
    state.task = defaultTask;
  },
  setIsNew(state, { payload }) {
    state.isNew = payload;
  },
  setTask(state, { payload }) {
    state.taskLoading = false;
    state.task = payload;
  },
  setTasks(state, { payload }) {
    state.tasksLoading = false;
    state.tasks = payload;
  },
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: { ...taskReducers, ...clientReducers },
});

export const { setTask, setTasks, setClient, setClients, setClientsLoading } =
  taskSlice.actions;

export default taskSlice.reducer;
