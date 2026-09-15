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

// Matches app/services/schedules/schedule_transactions_service.py's
// get_schedules_total_list exactly: { "data": Schedule[], "meta": {...} }.
// committeeId lives only in meta - every item is the same committee, so it
// isn't repeated per item.
export interface SchedulesMeta {
  reportId: string;
  committeeId: string | null;
  formType: string | null;
}

export interface SchedulesResponse {
  data: Schedule[];
  meta: SchedulesMeta;
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