export interface PipelineStage {
  id: string;
  workspace_id: string;
  name: string;
  count: number;
  position: number;
  color: string;
  created_at?: string;
}

export interface Activity {
  id: string;
  workspace_id: string;
  message: string;
  type?: string;
  created_at?: string;
}

export interface AutomationTask {
  id: string;
  workspace_id: string;
  task: string;
  status: string;
  created_at?: string;
}

export interface CustomerHealth {
  id: string;
  workspace_id: string;
  name: string;
  health: string;
  usage: number;
  created_at?: string;
}

export interface TeamPerformance {
  id: string;
  workspace_id: string;
  name: string;
  deals: number;
  close_rate: number;
  created_at?: string;
}

export interface RevenueForecast {
  id: string;
  workspace_id: string;
  month: string;
  value: number;
  created_at?: string;
}
