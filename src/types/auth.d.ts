export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  relatedEntityId: string;
  actionUrl: string;
  body?: any;
  data?: any;
  dir?: string;
  icon?: string;
  lang?: string;
  tag?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  vibrate?: number[];
}
