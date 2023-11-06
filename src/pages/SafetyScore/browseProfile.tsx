/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Button, Upload, message } from 'antd';
import styles from './styles/index.less';
import type { UploadProps } from 'antd';
import { baseUrl } from '../../services/safety-score/api';
import { useHistory, useLocation } from 'react-router-dom';
import type { SimulatorData } from '../../services/safety-score/type';

type DailyScoreItem = {
  start_date: string;
  daily_score: number;
};

function BrowserProfile(props: any) {
  const history = useHistory();
  const location = useLocation();
  const { onLoadingChange } = props;

  const [lastestDayData, setLastestDayData] = useState<DailyScoreItem>();
  const [simulatorData, setSimulatorData] = useState<SimulatorData>({
    vehicle_mileage: 0,
    hb_count: 0,
    ha_count: 0,
    sp_distance_above_85: 0,
    driving_calender_days: 0,
  });
  const [ssVersion, setSsVersion] = useState(0);
  const [dailyScore, setDailyScore] = useState<DailyScoreItem[]>([]);

  useEffect(() => {
    console.log('1111');
  }, [location.pathname]);

  const checkFileType = (file: any) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    const isAllowedType = allowedTypes.includes(file.type);

    if (!isAllowedType) {
      message.error('Please upload files ending in .xlsx, .xls, or .csv');
    }

    return isAllowedType;
  };
  const uploadProps: UploadProps = {
    name: 'file',
    action: `${baseUrl}/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: checkFileType,
    onChange(info) {
      onLoadingChange(true);

      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        onLoadingChange(false);
        const { daily_summary, vehicle_summary, uploaded_csv_tab, safety_score_version } =
          info.file.response;
        setSsVersion(safety_score_version);
        setSimulatorData({
          ...vehicle_summary,
        });
        setDailyScore(daily_summary);
        setLastestDayData(daily_summary.slice(-1)[0]);
        const fileData = {
          fileName: info.file.name,
          fileSize: info.file.size as number,
        };
        const fileHeaderList = uploaded_csv_tab;
        history.push({
          pathname: '/safetyScore/selectProfile',
          state: { fileData, fileHeaderList, simulatorData, lastestDayData, ssVersion, dailyScore },
        });

        console.log(info.file.response, 'info.file.response');
      } else if (info.file.status === 'error') {
        onLoadingChange(false);
        message.error(`${info.file.response.error}`);
      }
    },
  };
  return (
    <div className={styles.uploadFile}>
      <p className={styles.uploadFile_title}>
        {'BROWSE POLICY HOLDER’S PROFILE TO CALCULATE SCORE'}
      </p>
      <div className={styles.uploadButtons}>
        {
          <div className={styles.browserAll}>
            <Upload
              {...uploadProps}
              className={styles.customUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button className={styles.customIconButton}>
                <span className={styles.buttonContent}>{'BROWSE ALL'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </Upload>
          </div>
        }
      </div>
    </div>
  );
}

export default BrowserProfile;
