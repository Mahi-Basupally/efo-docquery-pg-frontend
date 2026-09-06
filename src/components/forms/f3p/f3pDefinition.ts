/** Frontend-only F3P presentation metadata. Backend supplies report data. */

export interface F3PLineDefinition {
  indent?: number;
  isTotal?: boolean;
  calculation?: string;
  hasSchedule?: boolean;
  scheduleType?: string;
  note?: string;
  valueType?: string;
  linkId?: string;
}

export const F3P_LINE_DEFINITIONS: Record<string, F3PLineDefinition> = {
  'f3p-line-16-order-1': {},
  'f3p-line-17-order-2': { valueType: 'header' },
  'f3p-line-17a-order-3': { indent: 1, valueType: 'header' },
  'f3p-line-17ai-order-4': { indent: 2, hasSchedule: true, scheduleType: 'SA' },
  'f3p-line-17aii-order-5': { indent: 2 },
  'f3p-line-17aiii-order-6': { indent: 2, isTotal: true },
  'f3p-line-17b-order-7': { indent: 1 },
  'f3p-line-17c-order-8': { indent: 1 },
  'f3p-line-17d-order-9': { indent: 1 },
  'f3p-line-17e-order-10': { isTotal: true, calculation: 'Add 17(a), 17(b), 17(c) and 17(d)' },
  'f3p-line-18-order-11': {},
  'f3p-line-19-order-12': { valueType: 'header' },
  'f3p-line-19a-order-13': { indent: 1 },
  'f3p-line-19b-order-14': { indent: 1 },
  'f3p-line-19c-order-15': { isTotal: true, calculation: 'Add 19(a) and 19(b)' },
  'f3p-line-20-order-16': { valueType: 'header' },
  'f3p-line-20a-order-17': { indent: 1 },
  'f3p-line-20b-order-18': { indent: 1 },
  'f3p-line-20c-order-19': { indent: 1 },
  'f3p-line-20d-order-20': { isTotal: true, calculation: 'Add 20(a), 20(b) and 20(c)' },
  'f3p-line-21-order-21': {},
  'f3p-line-22-order-22': { isTotal: true, calculation: 'Add 16, 17(e), 18, 19(c), 20(d) and 21' },
  'f3p-line-23-order-23': { hasSchedule: true, scheduleType: 'SB' },
  'f3p-line-24-order-24': {},
  'f3p-line-25-order-25': {},
  'f3p-line-26-order-26': {},
  'f3p-line-27-order-27': { valueType: 'header' },
  'f3p-line-27a-order-28': { indent: 1 },
  'f3p-line-27b-order-29': { indent: 1 },
  'f3p-line-27c-order-30': { indent: 1, isTotal: true, calculation: 'Add 27(a) and 27(b)' },
  'f3p-line-28-order-31': { valueType: 'header' },
  'f3p-line-28a-order-32': { indent: 1 },
  'f3p-line-28b-order-33': { indent: 1 },
  'f3p-line-28c-order-34': { indent: 1 },
  'f3p-line-28d-order-35': { indent: 1, isTotal: true, calculation: 'Add 28(a), 28(b) and 28(c)' },
  'f3p-line-29-order-36': {},
  'f3p-line-30-order-37': { isTotal: true, calculation: 'Add 23, 24, 25, 26, 27(c), 28(d) and 29' },
  'f3p-line-31-order-38': {},
  'f3p-line-al-order-39': {}, 'f3p-line-ak-order-40': {}, 'f3p-line-az-order-41': {},
  'f3p-line-ar-order-42': {}, 'f3p-line-ca-order-43': {}, 'f3p-line-co-order-44': {},
  'f3p-line-ct-order-45': {}, 'f3p-line-de-order-46': {}, 'f3p-line-dc-order-47': {},
  'f3p-line-fl-order-48': {}, 'f3p-line-ga-order-49': {}, 'f3p-line-hi-order-50': {},
  'f3p-line-id-order-51': {}, 'f3p-line-il-order-52': {}, 'f3p-line-in-order-53': {},
  'f3p-line-ia-order-54': {}, 'f3p-line-ks-order-55': {}, 'f3p-line-ky-order-56': {},
  'f3p-line-la-order-57': {}, 'f3p-line-me-order-58': {}, 'f3p-line-md-order-59': {},
  'f3p-line-ma-order-60': {}, 'f3p-line-mi-order-61': {}, 'f3p-line-mn-order-62': {},
  'f3p-line-ms-order-63': {}, 'f3p-line-mo-order-64': {}, 'f3p-line-mt-order-65': {},
  'f3p-line-ne-order-66': {}, 'f3p-line-nv-order-67': {}, 'f3p-line-nh-order-68': {},
  'f3p-line-nj-order-69': {}, 'f3p-line-nm-order-70': {}, 'f3p-line-ny-order-71': {},
  'f3p-line-nc-order-72': {}, 'f3p-line-nd-order-73': {}, 'f3p-line-oh-order-74': {},
  'f3p-line-ok-order-75': {}, 'f3p-line-or-order-76': {}, 'f3p-line-pa-order-77': {},
  'f3p-line-ri-order-78': {}, 'f3p-line-sc-order-79': {}, 'f3p-line-sd-order-80': {},
  'f3p-line-tn-order-81': {}, 'f3p-line-tx-order-82': {}, 'f3p-line-ut-order-83': {},
  'f3p-line-vt-order-84': {}, 'f3p-line-va-order-85': {}, 'f3p-line-wa-order-86': {},
  'f3p-line-wv-order-87': {}, 'f3p-line-wi-order-88': {}, 'f3p-line-wy-order-89': {},
  'f3p-line-pr-order-90': {}, 'f3p-line-gu-order-91': {}, 'f3p-line-vi-order-92': {},
  'f3p-line--order-93': {},
};
