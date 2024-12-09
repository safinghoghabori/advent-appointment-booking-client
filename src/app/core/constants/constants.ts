export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Approved = 'Approved',
  Canceled = 'Canceled',
}

export const MOVE_TYPES = [
  { value: 'drop full', label: 'Drop Full' },
  { value: 'pick full', label: 'Pick Full' },
  { value: 'drop empty', label: 'Drop Empty' },
  { value: 'pick empty', label: 'Pick Empty' },
  { value: 'pick refrigerated', label: 'Pick Refrigerated' },
  { value: 'drop refrigerated', label: 'Drop Refrigerated' },
];

export const SIZE_TYPES = [
  { value: '20FT General', label: '20FT General' },
  { value: '20FT High Cube', label: '20FT High Cube' },
  { value: '40FT General', label: '40FT General' },
  { value: '40FT High Cube', label: '40FT High Cube' },
];
