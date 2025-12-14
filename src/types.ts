export interface ReviewHistoryItem {
  id: number;
  appName: string;
  developer: string;
  reviewer: string;
  outcome: 'Approved' | 'Rejected';
  timestamp: string;
  notes: string;
}

export interface ReviewQueueItem {
  id: number;
  appName: string;
  version: string;
  status: 'In Review' | 'Pending';
  submitted: string;
}

export interface BackendHealthItem {
  service: string;
  status: 'Healthy' | 'Unhealthy';
  updated: string;
}

export interface ReviewItem {
  id: number;
  app: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}