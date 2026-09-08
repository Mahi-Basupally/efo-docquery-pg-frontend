import { apiClient } from './client';
import type { PaginationMeta } from './types';

export interface ScheduleBTransaction {
  filerCommitteeId?: string | null;
  transactionId?: string | null;
  backReferenceTransactionId?: string | null;
  backReferenceScheduleName?: string | null;
  entityType?: string | null;
  entityName?: string | null;
  entityLastName?: string | null;
  entityFirstName?: string | null;
  entityMiddleName?: string | null;
  entityPrefix?: string | null;
  entitySuffix?: string | null;
  streetAddress1?: string | null;
  streetAddress2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  electionType?: string | null;
  electionDescription?: string | null;
  disbursementDate?: string | null;
  amount?: string | number | null;
  scheduleAReferenceAmount?: string | number | null;
  transactionDescription?: string | null;
  cat_code?: string | null;
  other_comid?: string | null;
  beneficiaryCommitteeName?: string | null;
  other_canid?: string | null;
  can_name?: string | null;
  can_fname?: string | null;
  can_mname?: string | null;
  can_prefix?: string | null;
  can_suffix?: string | null;
  can_off?: string | null;
  can_state?: string | null;
  can_dist?: string | number | null;
  other_name?: string | null;
  other_str1?: string | null;
  other_str2?: string | null;
  other_city?: string | null;
  other_state?: string | null;
  other_zip?: string | null;
  memoCode?: string | null;
  memoText?: string | null;
  nc_softacct?: string | null;
  imageno?: number | null;
  [key: string]: unknown;
}

export interface ScheduleBResponse {
  data: ScheduleBTransaction[];
  meta: {
    reportId: string | number;
    schedule: string;
    lineNumber: string;
    pagination: PaginationMeta;
  };
}

export const scheduleBApi = {
  getScheduleBData: async (
    repid: string,
    lineNum: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ScheduleBResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page !== undefined) queryParams.set('page', String(params.page));
    if (params.perPage !== undefined) queryParams.set('perPage', String(params.perPage));

    const query = queryParams.toString();
    const response = await apiClient.get<ScheduleBResponse>(
      `/sb/${repid}/${lineNum}${query ? `?${query}` : ''}`
    );
    return response.data;
  },
};
