import { apiClient } from './client';

export interface ScheduleSubLink {
  lineNum: string;
  numOfTrans: number;
}

export interface Schedule {
  name: string;
  schedule: string;
  subLinks: ScheduleSubLink[];
  totalTransactions: number;
}

export interface SchedulesMeta {
  reportId: string;
  totalSchedules: number;
  totalTransactions: number;
}

export interface SchedulesResponse {
  data: Schedule[];
  meta?: {
    reportId: string;
    committeeId: string;
    totalSchedules: number;
    totalTransactions: number;
  };
  message?: string;
}

export interface ErrorResponse {
  error: string;
}

export const scheduleApi = {
  getSchedulesByRepid: async (repid: string) => {
    const response = await apiClient.get(`/reports/${repid}/schedules`);
    return response.data;
  },
};