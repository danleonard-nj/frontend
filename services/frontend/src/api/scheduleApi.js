import { serviceScopes } from '../msalConfig';
import ApiBase from './apiBase';
import AzureGatewayApi from './azureGatewayApi';

export default class ScheduleApi extends ApiBase {
  constructor() {
    super(serviceScopes.scheduler);
    this.azureGatewayApi = new AzureGatewayApi();
  }

  async getSchedules() {
    return await this.send(`${this.baseUrl}/api/scheduler/schedule`, 'GET');
  }

  async getSchedule(scheduleId) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/schedule/${scheduleId}`,
      'GET'
    );
  }

  async runSchedule(scheduleId) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/schedule/${scheduleId}/run`,
      'POST',
      null,
      { noContent: true }
    );
  }

  async deleteTask(taskId) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/task/${taskId}`,
      'DELETE',
      null,
      { noContent: true }
    );
  }

  async deleteSchedule(scheduleId) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/schedule/${scheduleId}`,
      'DELETE'
    );
  }

  async updateSchedule(schedule) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/schedule`,
      'PUT',
      schedule
    );
  }

  async insertSchedule(schedule) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/schedule`,
      'POST',
      schedule
    );
  }

  async updateTask(task) {
    return await this.send(`${this.baseUrl}/api/scheduler/task`, 'PUT', task);
  }

  async insertTask(task) {
    return await this.send(`${this.baseUrl}/api/scheduler/task`, 'POST', task);
  }

  async getTasks() {
    return await this.send(`${this.baseUrl}/api/scheduler/task`, 'GET');
  }

  async getTask(taskId) {
    return await this.send(
      `${this.baseUrl}/api/scheduler/task/${taskId}`,
      'GET'
    );
  }

  async getClients() {
    return await this.azureGatewayApi.getActiveDirectoryApplications();
  }
}
