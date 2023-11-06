/* eslint-disable react/self-closing-comp */
import { useEffect, useState } from 'react';
import styles from './styles/index.less';
import type { UploadProps } from 'antd';
import { fetchDiscount } from '../../services/safety-score/api';
import { useLocation, useHistory } from 'react-router-dom';
import { baseUrl } from '../../services/safety-score/api';
import * as echarts from 'echarts';
import { Button, Upload, message } from 'antd';

function ScoreHistogram(props: any) {
  const location = useLocation();
  console.log(location.state, 'location.state');
  const [discout, setDisount] = useState(0);
  const { onLoadingChange } = props;
  const { simulatorData, lastestDayData, ssVersion, dailyScore } = location.state as any;

  const history = useHistory();

  // get discount data
  const getDiscount = (avg_score: number) => {
    onLoadingChange(true);
    fetchDiscount(avg_score)
      .then((data) => {
        setDisount(data.discount_rate);
        onLoadingChange(false);
      })
      .catch((error) => {
        onLoadingChange(false);
        console.error('Error fetching user info:', error);
      });
  };

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
        const fileData = {
          fileName: info.file.name,
          fileSize: info.file.size as number,
        };
        const fileHeaderList = uploaded_csv_tab;
        history.push({
          pathname: '/safetyScore/selectProfile',
          state: { fileData, fileHeaderList },
        });

        console.log(info.file.response, 'info.file.response');
      } else if (info.file.status === 'error') {
        onLoadingChange(false);
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const safetyScoreClick = () => {};
  useEffect(() => {
    getDiscount(simulatorData.vehicle_safety_score);
    const initializeChart = async () => {
      const chart = echarts.init(document.getElementById('chart-container'));
      const timeData = dailyScore?.map((item: any) => item.start_date);
      const scoreData = dailyScore?.map((item: any) => item.daily_score);

      const options = {
        color: ['#6cf96a'],
        tooltip: {
          position: 'top',
          trigger: 'axis',
          backgroundColor: 'rgba(37, 51, 61, 0.8)',
          borderColor: 'rgba(37, 51, 61, 0.8)',
          textStyle: {
            color: ['#6cf96a'],
          },
          axisPointer: {
            type: 'shadow',
          },
        },
        title: {
          text: 'SAFETY SCORE',
          textStyle: {
            align: 'right',
          },
        },
        xAxis: {
          type: 'category',
          data: timeData ?? [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: scoreData ?? [],
            type: 'bar',
            markLine: {
              data: [
                {
                  yAxis: simulatorData.vehicle_safety_score,
                  lineStyle: {
                    color: 'red',
                    type: 'dashed',
                  },
                  label: {
                    show: true,
                    position: 'end',
                    textStyle: {
                      color: 'red',
                    },
                  },
                },
              ],
            },
          },
        ],
      };

      chart.setOption(options);
    };

    initializeChart();
  }, []);
  return (
    <div>
      <div className={styles.displayWrapper}>
        <div id="chart-container" className={styles.safetyScoreChart}></div>
        <div className={styles.disCountWrapper}>
          <div className={styles.discountContainer}>
            <div>
              <span className={styles.title}>DATE</span>
              <div className={styles.disCount}>{`${lastestDayData?.start_date}`}</div>
            </div>
            <div>
              <span className={styles.title}>AVG.SAFETY SCORE</span>
              <div
                className={`${styles.disCount} ${
                  Number(simulatorData.vehicle_safety_score.toFixed(2)) >= 0
                    ? styles.greenText
                    : styles.redText
                }`}
              >
                {simulatorData.vehicle_safety_score.toFixed(2)}
              </div>
            </div>
            <div>
              <span className={styles.title}>DISCOUNT</span>
              <div
                className={`${styles.disCount} ${
                  1 - discout >= 0 ? styles.greenText : styles.redText
                }`}
              >
                {((1 - discout) * 100).toFixed(1)} %
              </div>
            </div>
            {/* ss Version */}
            <div className={styles.sVersion}>
              <span className={styles.title}>SS VERSION: {ssVersion}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.uploadFile}>
        <div className={styles.uploadButtons}>
          <div className={styles.browserAll}>
            <Upload {...props} className={styles.customUpload} maxCount={1} showUploadList={false}>
              <Button className={styles.customIconButton}>
                <span className={styles.buttonContent}>{'BROWSE AGAIN'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </Upload>
          </div>

          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={safetyScoreClick}>
              <span className={styles.buttonContent}>{'SAFETY SCORE SIMULATOR'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreHistogram;
