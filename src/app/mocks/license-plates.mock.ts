import type { LicensePlate } from '../pages/license-plate/license-plate.component';

export const LICENSE_PLATES: LicensePlate[] = [
  {
    number: '29A-12345',
    type: 'oto',
    active: true,
    last_run_at: '2025-05-06T10:00:00Z',
    violations_count: 2
  },
  {
    number: '59D1-67890',
    type: 'xe máy',
    active: false,
    last_run_at: '2025-05-04T08:20:00Z',
    violations_count: 0
  },
  {
    number: '30E-56789',
    type: 'oto',
    active: true,
    last_run_at: '2025-05-05T15:45:00Z',
    violations_count: 1
  }
];
