/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
import { useState } from 'react';
import styles from './styles/index.less';
import type { UploadProps } from 'antd';
import { baseUrl } from '../../services/safety-score/api';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Upload, message } from 'antd';
import type { SimulatorData } from '../../services/safety-score/type';

interface RouteState {
  fileData: { fileName: string; fileSize: number };
  fileHeaderList: string[];
}

type DailyScoreItem = {
  start_date: string;
  daily_score: number;
};

function SelectProfile(props: any) {
  const location = useLocation();

  const history = useHistory();

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

  const { onLoadingChange } = props;

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
          state: { fileData, fileHeaderList },
        });
      } else if (info.file.status === 'error') {
        onLoadingChange(false);
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const { fileData, fileHeaderList } = location.state as RouteState;

  const Tables = () => {
    const tableData = [fileHeaderList];

    const tableRows = tableData?.map((rowData, rowIndex) => (
      <tr key={rowIndex}>
        {rowData?.map((cellData, cellIndex) => (
          <td key={cellIndex}>{cellData}</td>
        ))}
      </tr>
    ));

    return (
      <table className="bordered-table">
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  const handleSubmit = () => {
    history.push({
      pathname: '/safetyScore/scoreHistogram',
      state: { simulatorData, lastestDayData, ssVersion, dailyScore },
    });
  };
  return (
    <div className={styles.uploadFile}>
      <p className={styles.uploadFile_title}>{'File Selected'}</p>
      <div className={styles.fileList}>
        <span className={styles.fileName}>FileName ：</span>
        {`[ ${fileData.fileName} ]`}
        <span className={styles.fileSize}>FileSize ：</span>
        {`${(fileData.fileSize / 1024).toFixed(0)}（KB）`}
        <div className={styles.schema}>
          <span className={styles.fileName}>Schema</span>
          <div className={styles.schema_content}>
            <Tables></Tables>
          </div>
        </div>
      </div>
      <div className={styles.uploadButtons}>
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
        <div className={styles.customUpload}>
          <Button className={styles.customIconButton} onClick={handleSubmit}>
            <span className={styles.buttonContent}>{'SUBMIT'}</span>
            <span className={styles.iconWrapper}></span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SelectProfile;
