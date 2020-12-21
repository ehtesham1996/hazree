/**
 * Color variable used for teams page
 * to be used dynamically later with settings
 */
export enum UserLastActivityColor {
  inColor = '#00366F',
  outColor = '#ccc'
}

export type UserLastActivityData = {
  lastActivity: string;
  activitySince: string;
  activityDate: string;
  time: string;
  color: UserLastActivityColor;
}
