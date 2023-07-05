import autoBind from 'auto-bind';
import { defaultSchedule } from '../../api/data/schedule';
import { popErrorMessage, popMessage } from '../alert/alertActions';
import {
  setIsNew,
  setLinkOptions,
  setSchedule,
  setScheduleHistory,
  setScheduleHistoryLoading,
  setScheduleLoading,
  setSchedules,
} from './scheduleSlice';
import {
  getErrorMessage,
  sortBy,
} from '../../api/helpers/apiHelpers';
import ScheduleApi from '../../api/scheduleApi';

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

      const sortedSchedules = sortBy(response?.data, 'ScheduleName');

      // Pop error message on failed status
      handleResultMessage(response?.status);
      dispatch(setSchedules(response?.data));
    };
  }

  getScheduleHistory(startTimestamp) {
    return async (dispatch, getState) => {
      const handleResultMessage = (status) => {
        if (status !== 200) {
          dispatch(
            popErrorMessage('Failed to fetch schedule history')
          );
        }
      };

      dispatch(setScheduleHistoryLoading(true));

      // Fetch schedule history
      const endTimestamp = Math.round(new Date().getTime() / 1000);
      const response = await this.scheduleApi.getScheduleHistory(
        startTimestamp,
        endTimestamp
      );

      // Pop error message on failed status
      handleResultMessage(response?.status);
      dispatch(setScheduleHistory(response?.data));
    };
  }

  getAvailableTasks(schedule, tasks) {
    const scheduleTasks = schedule?.links?.map((x) => x.taskId) ?? [];
    const filteredTasks =
      tasks.filter((task) => !scheduleTasks.includes(task.taskId)) ??
      [];
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
      dispatch(setScheduleLoading(true));

      const {
        schedule: { schedule },
      } = getState();

      const handleErrorResponse = ({ status, data }) => {
        dispatch(
          popErrorMessage(
            `Failed to add task to schedule: ${getErrorMessage(
              data
            )} `
          )
        );
      };

      // Add new link to schedule
      const response = await this.scheduleApi.updateSchedule({
        ...schedule,
        links: [...schedule.links, taskId],
      });

      response.status > 200
        ? handleErrorResponse(response)
        : dispatch(popMessage('Task added to schedule'));

      // Refresh the schedule list
      dispatch(this.getSchedules());
      dispatch(setScheduleLoading(false));
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

      const response = await this.scheduleApi.deleteSchedule(
        scheduleId
      );
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
      const {
        schedule: { schedule, isNew },
      } = getState();

      dispatch(setScheduleLoading(true));

      // const schedule = state.schedule.schedule;
      // const validTasks = removeInvalidTasks(
      //   state.task.tasks,
      //   schedule
      // );
      // const updatedSchedule = { ...schedule, links: validTasks };

      // Handle success/failure messages
      const handleResultMessage = ({ status, data }) => {
        if (status === 200) {
          dispatch(popMessage(`Schedule updated successfully`));
        } else {
          dispatch(
            popErrorMessage(
              `Failed to update schedule: ${getErrorMessage(data)}`
            )
          );
        }
      };

      // If schedule is new, insert else update
      if (!isNew) {
        const updateResponse = await this.scheduleApi.updateSchedule(
          schedule
        );

        handleResultMessage(updateResponse);
      } else {
        dispatch(setIsNew(false));
        const insertResponse = await this.scheduleApi.insertSchedule(
          schedule
        );
        // Pop result message
        handleResultMessage(insertResponse);
      }

      // Refresh the schedule list
      dispatch(this.getSchedules());
      dispatch(setScheduleLoading(false));
    };
  }

  updateScheduleState(innerReducer) {
    return (dispatch, getState) => {
      const state = getState();
      const schedule = state.schedule.schedule;

      dispatch(setSchedule(innerReducer(schedule)));
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

  removeSelectedScheduleLink(taskId) {
    return (dispatch, getState) => {
      const {
        schedule: { schedule },
      } = getState();

      // If the schedule doesn't contain the task, return
      if (!schedule.links.includes(taskId)) {
        return;
      }

      // Remove the task from the schedule
      dispatch(
        setSchedule({
          ...schedule,
          links: schedule.links.filter((x) => x !== taskId),
        })
      );

      dispatch(popMessage('Task removed from schedule'));
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
  getScheduleHistory,
  removeSelectedScheduleLink,
} = new ScheduleActions();
