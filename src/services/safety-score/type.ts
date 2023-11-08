export type SimulatorData = {
  driving_calender_days?: number;
  ha_count: number;
  hb_count: number;
  sp_distance_above_85: number;
  vehicle_mileage?: number;
  vehicle_safety_score?: number;
  discout?: number;
};

export type FileDatas = {
  fileName: string;
  fileSize: number;
};

export type DailyScoreItem = {
  start_date: string;
  daily_score: number;
};

export type fileInfo = {
  fileName: string;
  fileSize: number;
};

export type RouteState = {
  fileData: fileInfo;
  fileHeaderList: string[];
  simulatorData?: SimulatorData;
  ssVersion: string;
  dailyScore: DailyScoreItem[];
  lastestDayData?: DailyScoreItem;
};
export type CustomSessionStatus = {
  simulatorData?: SimulatorData;
  lastestDayData?: DailyScoreItem;
  ssVersion: string;
  discount: number;
};
