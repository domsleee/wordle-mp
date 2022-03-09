export type INotificationType = "info" | "warning" | "error";

export interface MyNotification {
  type: INotificationType;
  msg: string;
  error?: unknown;
}

export interface StoredNotification extends MyNotification {
  id: number;
  isHidden: boolean;
}
