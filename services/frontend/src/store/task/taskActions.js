import autoBind from 'auto-bind';
import { defaultTask } from '../../api/helpers/taskHelpers';
import ScheduleApi from '../../api/scheduleApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import { setIsNew } from '../schedule/scheduleSlice';
import { setClients, setTask, setTasks } from './taskSlice';

export default class TaskActions {
  constructor() {
    this.scheduleApi = new ScheduleApi();
    autoBind(this);
  }

  updateTaskState(func) {
    return (dispatch, getState) => {
      const state = getState();
      const task = state.task.task;
      dispatch(setTask(func(task)));
    };
  }

  getTasks() {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch task list'));
        }
      };

      const response = await this.scheduleApi.getTasks();

      // Pop message on failure
      handleResultMessage(response?.status);

      // Update task list on successful request
      if (response.status) {
        dispatch(setTasks(response?.data));
      }
    };
  }

  getClients() {
    return async (dispatch, getState) => {
      const clients = await this.scheduleApi.getClients();
      dispatch(setClients(clients));
    };
  }

  getTask(taskId) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch task'));
        }
      };

      const response = await this.scheduleApi.getTask(taskId);

      // Handle failure message
      handleResultMessage(response?.status);

      // Update task state on success
      if (response?.status === 200) {
        dispatch(setTask(response?.data));
      }
    };
  }

  saveTask() {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status === 200) {
          dispatch(popMessage('Task saved successfully'));
        } else {
          dispatch(popErrorMessage('Failed to update task'));
        }
      };

      const state = getState().task;

      // Handle insert for new tasks
      if (state.isNew) {
        dispatch(setIsNew(false));
        const insertResult = await this.scheduleApi.insertTask(state.task);

        // Pop message on insert failure
        handleResultMessage(insertResult?.status);

        // Handle updates
      } else {
        const updateResult = await this.scheduleApi.updateTask(state.task);

        // Pop message on update faliure
        handleResultMessage(updateResult?.status);
      }

      // Fetch updated task list
      const response = await this.scheduleApi.getTasks();

      // Update task list state on successful request
      if (response?.status === 200) {
        dispatch(setTasks(response?.data));
      }
    };
  }

  deleteTask(taskId) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status === 200) {
          dispatch(popMessage('Task deleted successfully'));
        } else {
          dispatch(popErrorMessage('Failed to delete task'));
        }
      };

      // Delete the selected task
      const response = await this.scheduleApi.deleteTask(taskId);
      handleResultMessage(response?.status);

      // Set selected task state on successful update
      if (response.status === 200) {
        dispatch(popMessage('Task deleted successfully'));
        dispatch(setTask(defaultTask));
      }

      const tasksResponse = await this.scheduleApi.getTasks();

      // Update task list state on successful request and pop a
      // message on failure
      if (tasksResponse.status === 200) {
        dispatch(setTasks(tasksResponse?.data));
      } else {
        dispatch(popErrorMessage('Failed to fetch updated task list'));
      }
    };
  }
}

export const {
  deleteTask,
  saveTask,
  getTask,
  getClients,
  getTasks,
  updateTaskState,
} = new TaskActions();
