import autoBind from 'auto-bind';
import { defaultSchedule } from '../../api/data/schedule';
import ScheduleApi from '../../api/scheduleApi';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setIsNew,
  setLinkOptions,
  setSchedule,
  setSchedules,
} from './scheduleSlice';

export default class ScheduleActions {
  constructor() {
    this.scheduleApi = new ScheduleApi();
    autoBind(this);
  }

  getSchedules() {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch schedule list'));
        }
      };

      // Fetch schedule list
      const response = await this.scheduleApi.getSchedules();

      // Pop error message on failed status
      handleResultMessage(response?.status);
      dispatch(setSchedules(response?.data));
    };
  }

  getAvailableTasks(schedule, tasks) {
    const scheduleTasks = schedule?.links?.map((x) => x.taskId) ?? [];
    const filteredTasks =
      tasks.filter((task) => !scheduleTasks.includes(task.taskId)) ?? [];
    return filteredTasks;
  }

  getLinkOptions() {
    return (dispatch, getState) => {
      const state = getState();

      const tasks = state.task.tasks;
      const schedule = state.schedule.schedule;

      const linkOptions = getAvailableTasks(schedule, tasks);
      dispatch(setLinkOptions(linkOptions));
    };
  }

  addLink(taskId) {
    return async (dispatch, getState) => {
      const state = getState();

      const updatedSchedule = {
        ...state.schedule.schedule,
        links: [...state.schedule.schedule.links, taskId],
      };

      dispatch(setSchedule(updatedSchedule));
      await this.scheduleApi.updateSchedule(updatedSchedule);
    };
  }

  getSchedule(scheduleId) {
    return async (dispatch, getState) => {
      const state = getState();
      const handleResultMessage = (status) => {
        if (status !== 200) {
          dispatch(popErrorMessage('Failed to fetch schedule'));
        }
      };

      // If the new schedule flag is set, flip it off
      // when selecting an existing schedule to allow
      // for updates
      if (state.schedule?.isNew) {
        dispatch(setIsNew(false));
      }

      // Fetch schedule
      const response = await this.scheduleApi.getSchedule(scheduleId);

      // Pop error message on failure
      handleResultMessage(response?.status);
      dispatch(setSchedule(response?.data));
    };
  }

  deleteSchedule(scheduleId) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status === 200) {
          dispatch(popMessage('Schedule deleted successfully'));
        } else {
          dispatch(popErrorMessage('Failed to delete schedule'));
        }
      };

      const response = await this.scheduleApi.deleteSchedule(scheduleId);
      handleResultMessage(response?.status);

      // Set selected schedule to default values since we
      // deleted the currently selected schedule
      dispatch(setSchedule(defaultSchedule));

      // Update the schedule list
      const schedulesResponse = await this.scheduleApi.getSchedules();
      dispatch(setSchedules(schedulesResponse.data));
    };
  }

  removeInvalidTasks(tasks, schedule) {
    const validTasks = [];

    schedule.links.forEach((taskId) => {
      if (tasks.find((x) => x.taskId == taskId)) {
        validTasks.push(taskId);
      }
    });

    return validTasks;
  }

  saveSchedule() {
    return async (dispatch, getState) => {
      const state = getState();

      const schedule = state.schedule.schedule;
      const validTasks = removeInvalidTasks(state.task.tasks, schedule);
      const updatedSchedule = { ...schedule, links: validTasks };

      const handleResultMessage = (status) => {
        if (status === 200) {
          dispatch(popMessage(`Schedule updated successfully`));
        } else {
          dispatch(popErrorMessage('Failed to update schedule'));
        }
      };

      // If schedule is new, insert else update
      if (!state.schedule.isNew) {
        const updateResponse = await this.scheduleApi.updateSchedule(
          updatedSchedule
        );
        // Pop result message
        handleResultMessage(updateResponse.status);
      } else {
        dispatch(setIsNew(false));
        const insertResponse = await this.scheduleApi.insertSchedule(
          updatedSchedule
        );
        // Pop result message
        handleResultMessage(insertResponse.status);
      }

      // Refresh the schedule list
      var response = await this.scheduleApi.getSchedules();
      dispatch(setSchedules(response?.data));
    };
  }

  updateScheduleState(func) {
    return (dispatch, getState) => {
      const state = getState();
      const schedule = state.schedule.schedule;

      dispatch(setSchedule(func(schedule)));
    };
  }

  runSchedule(scheduleId) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status === 200) {
          dispatch(popMessage('Schedule executed successfully'));
        } else {
          dispatch(popErrorMessage('Failed to execute schedule'));
        }
      };

      // Run the selected schedule
      const response = await this.scheduleApi.runSchedule(scheduleId);
      handleResultMessage(response?.status);
    };
  }
}

export const {
  runSchedule,
  updateScheduleState,
  saveSchedule,
  removeInvalidTasks,
  deleteSchedule,
  getSchedule,
  addLink,
  getLinkOptions,
  getAvailableTasks,
  getSchedules,
} = new ScheduleActions();
