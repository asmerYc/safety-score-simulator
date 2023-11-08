import { request } from 'umi';
import type { SimulatorData, RouteState, CustomSessionStatus } from './type';

export const baseUrl = 'https://sss-backend.novo.us';

// common apis defined

export async function fetchDiscount(avg_score: number) {
  return request(`${baseUrl}/api/get_discount?safety_score=${avg_score}`);
}

export async function fetchSimulator(simulator: SimulatorData) {
  return request(
    `${baseUrl}/api/get_safety_score?trip_mileage=${simulator.vehicle_mileage}&hb_count=${simulator.hb_count}&ha_count=${simulator.ha_count}&sp_distance_above_85=${simulator.sp_distance_above_85}`,
    { skipErrorHandler: true },
  );
}

export async function fetchScoreFactor() {
  return request(`${baseUrl}/api/get_safety_score_factors`, { skipErrorHandler: true });
}

export async function fetchDownloadScoreFactor() {
  return request(`${baseUrl}/api/download`, { skipErrorHandler: true });
}

export async function fetchPremiumData(file: any, score: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('safety_score', JSON.stringify(score));
  return request(`${baseUrl}/api/get_premium`, {
    method: 'POST',
    data: formData,
    skipErrorHandler: true,
  });
}

// common function parts
export function initialFileData({
  simulatorData,
  lastestDayData,
  ssVersion,
  dailyScore,
  fileData,
  fileHeaderList,
}: RouteState) {
  sessionStorage.setItem('simulatorData', JSON.stringify(simulatorData));
  sessionStorage.setItem('lastestDayData', JSON.stringify(lastestDayData));
  sessionStorage.setItem('ssVersion', JSON.stringify(ssVersion));
  sessionStorage.setItem('dailyScore', JSON.stringify(dailyScore));
  sessionStorage.setItem('fileData', JSON.stringify(fileData));
  sessionStorage.setItem('fileHeaderList', JSON.stringify(fileHeaderList));
}

export function getFileData() {
  const simulatorData = sessionStorage.getItem('simulatorData');
  const lastestDayData = sessionStorage.getItem('lastestDayData');
  const ssVersion = sessionStorage.getItem('ssVersion');
  const dailyScore = sessionStorage.getItem('dailyScore');
  const fileData = sessionStorage.getItem('fileData');
  const fileHeaderList = sessionStorage.getItem('fileHeaderList');

  return {
    simulatorData: simulatorData ? JSON.parse(simulatorData) : null,
    lastestDayData: lastestDayData ? JSON.parse(lastestDayData) : null,
    ssVersion: ssVersion ? JSON.parse(ssVersion) : null,
    dailyScore: dailyScore ? JSON.parse(dailyScore) : null,
    fileData: fileData ? JSON.parse(fileData) : null,
    fileHeaderList: fileHeaderList ? JSON.parse(fileHeaderList) : null,
  };
}

export function initialCustomData({
  simulatorData,
  lastestDayData,
  ssVersion,
  discount,
}: CustomSessionStatus) {
  sessionStorage.setItem('simulatorData', JSON.stringify(simulatorData));
  sessionStorage.setItem('lastestDayData', JSON.stringify(lastestDayData));
  sessionStorage.setItem('ssVersion', JSON.stringify(ssVersion));
  sessionStorage.setItem('discount', JSON.stringify(discount));
}

export function getCustomData() {
  const simulatorData = sessionStorage.getItem('simulatorData');
  const lastestDayData = sessionStorage.getItem('lastestDayData');
  const ssVersion = sessionStorage.getItem('ssVersion');
  const discount = sessionStorage.getItem('discount');

  return {
    simulatorData: simulatorData ? JSON.parse(simulatorData) : null,
    lastestDayData: lastestDayData ? JSON.parse(lastestDayData) : null,
    ssVersion: ssVersion ? JSON.parse(ssVersion) : null,
    discount: discount ? JSON.parse(discount) : null,
  };
}
