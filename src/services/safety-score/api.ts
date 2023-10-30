import { request } from 'umi';
import type { SimulatorData } from './type';

export const baseUrl = 'http://ec2d-autodenalientitysvc-01.mypna.com:7777';

export async function fetchDiscount(avg_score: number) {
  return request(`${baseUrl}/api/get_discount?safety_score=${avg_score}`);
}

export async function fetchSimulator(simulator: SimulatorData) {
  return request(
    `${baseUrl}/api/get_safety_score?trip_mileage=${simulator.vehicle_mileage}&hb_count=${simulator.hb_count}&ha_count=${simulator.ha_count}&sp_distance_above_85=${simulator.sp_distance_above_85}&duration_days=${simulator.driving_calender_days}`,
  );
}

export async function fetchScoreFactor() {
  return request(`${baseUrl}/api/get_safety_score_factors`);
}

export async function fetchDownloadScoreFactor() {
  return request(`${baseUrl}/api/download`);
}

export async function fetchPremiumData(file: any, score: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('safety_score', JSON.stringify(score));
  return request(`${baseUrl}/api/get_premium`, {
    method: 'POST',
    data: formData,
  });
}
