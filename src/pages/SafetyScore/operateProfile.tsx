import React, { useEffect, useState } from 'react';
import styles from './styles/index.less';
import { Button, Upload, message, Spin, InputNumber, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { SimulatorData } from '../../services/safety-score/type';
import {
  fetchDiscount,
  baseUrl,
  fetchSimulator,
  fetchScoreFactor,
  fetchPremiumData,
} from '../../services/safety-score/api';
import * as echarts from 'echarts';

type DataType = {
  key: React.Key;
  factor: number;
  safetyScore: number;
};

type DailyScoreItem = {
  start_date: string;
  daily_score: number;
};

type PremiumFile = {
  fileName: string;
  fileUploadStatus: boolean;
  file: any;
};

type PremiumData = {
  Economy: number;
  Comfort: number;
  Turbo: number;
};

function OperateProfile(props: any) {
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [initChartStatus, setInitChartStatus] = useState(false);
  const [isShowUploadList, setIsShowUploadList] = useState(false);
  const [initPremiumStatus, setInitPremiumStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showSimulator, setShowSimulator] = useState(true);

  const [lastestDayData, setLastestDayData] = useState<DailyScoreItem>();
  const [vehicleSummary, setVehicleSummary] = useState<SimulatorData>({
    vehicle_mileage: 0,
    hb_count: 0,
    ha_count: 0,
    sp_distance_above_85: 0,
    driving_calender_days: 0,
  });

  const [fileName, setFileName] = useState('');
  const [fileHeadList, setFileHeadList] = useState([]);
  const [fileSize, setFileSize] = useState<number>(0);

  // origrional score and discount
  const [originalAvgScore, setOriginalAvgScore] = useState(0);
  const [originalDiscout, setOriginalDiscout] = useState(0);

  // current  score and discount
  const [avgScore, setAvgScore] = useState(0);
  const [curContent, setCurContent] = useState('simulator');

  const [discout, setDisount] = useState(0);
  const [ssVersion, setSsVersion] = useState(0);
  const [factorCount, setFactorCount] = useState(0);
  const [scoreFactorData, setScoreFactorData] = useState([]);
  const [simulatorData, setSimulatorData] = useState<SimulatorData>({
    vehicle_mileage: 0,
    hb_count: 0,
    ha_count: 0,
    sp_distance_above_85: 0,
    driving_calender_days: 0,
  });
  const [dailyScore, setDailyScore] = useState<DailyScoreItem[]>([]);
  const [premiumFile, setPremiumFile] = useState<PremiumFile>({
    fileName: 'No Data',
    fileUploadStatus: false,
    file: null,
  });

  const [premiumData, setPremiumData] = useState<PremiumData>({
    Economy: 0,
    Comfort: 0,
    Turbo: 0,
  });

  const [premiumSafetyScore, setPremiumSafetyScore] = useState(0);

  const columns: ColumnsType<DataType> = [
    {
      title: 'SAFETY SCORE',
      dataIndex: 'safetyScore',
      width: 350,
    },
    {
      title: 'FACTOR',
      dataIndex: 'factor',
    },
  ];

  useEffect(() => {
    if (initChartStatus && showTable && showSimulator) {
      const initializeChart = async () => {
        const chart = echarts.init(document.getElementById('chart-container'));
        const timeData = dailyScore?.map((item) => item.start_date);
        const scoreData = dailyScore?.map((item) => item.daily_score);

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
                    yAxis: originalAvgScore,
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
    }
  }, [initChartStatus, dailyScore, originalAvgScore, showTable, showSimulator]);

  const Tables = () => {
    const tableData = [fileHeadList];

    const tableRows = tableData.map((rowData, rowIndex) => (
      <tr key={rowIndex}>
        {rowData.map((cellData, cellIndex) => (
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

  const factorCountClick = () => {
    setFactorCount(factorCount + 1);
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

  const premiumInputChange = (value: number) => {
    setPremiumSafetyScore(value);
  };

  // get discount data
  const getDiscount = (avg_score: number, flag?: string) => {
    fetchDiscount(avg_score)
      .then((data) => {
        setInitChartStatus(true);
        if (flag) {
          setDisount(data.discount_rate);
        } else {
          setOriginalDiscout(data.discount_rate);
          setDisount(data.discount_rate);
        }
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  };

  // get simulator data
  const getSimulator = () => {
    setLoading(true);
    fetchSimulator(simulatorData)
      .then((data) => {
        setAvgScore(data.daily_score);
        getDiscount(data.daily_score, 'simulator');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        message.error(
          `Error fetching user info: float division by zero, Please write valid count data}`,
        );
      });
  };

  // get score factor data
  const getScoreFactor = () => {
    setLoading(true);
    fetchScoreFactor()
      .then((data) => {
        setLoading(false);
        const newData = data.map((item: any, index: number) => {
          return {
            key: index,
            factor: item.factor,
            safetyScore: item.safety_score,
          };
        });
        setScoreFactorData(newData);
      })
      .catch((error) => {
        setLoading(false);
        message.error(`Error fetching scoreFactor}`);
      });
  };

  const getPremiumData = () => {
    if (premiumFile.fileName && premiumFile.fileUploadStatus && premiumSafetyScore > 0) {
      setLoading(true);
      fetchPremiumData(premiumFile.file, premiumSafetyScore)
        .then((data) => {
          setLoading(false);
          const formattedData = data.reduce((result: any, item: any) => {
            const { OptionName, OptionDetails } = item;
            const { Premium } = OptionDetails;
            result[OptionName] = Premium;
            return result;
          }, {});
          setPremiumData(formattedData);
        })
        .catch((error) => {
          message.error('upload failed' + `${error}`);
          setLoading(false);
        });
    } else {
      message.warning('Please upload the file and add the safety score first');
      setLoading(false);
    }
  };

  const profileprops: UploadProps = {
    name: 'file',
    action: `${baseUrl}/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: checkFileType,
    onChange(info) {
      setInitChartStatus(false);
      setLoading(true);
      setShowTable(true);
      setShowSimulator(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        setFileName(info.file.name);
        setFileSize(info.file.size as number);
        message.success(`${info.file.name} file uploaded successfully`);
        setLoading(false);
        setIsShowUploadList(true);
        const { daily_summary, vehicle_summary, uploaded_csv_tab, safety_score_version } =
          info.file.response;
        setVehicleSummary(vehicle_summary);
        setSsVersion(safety_score_version);
        setSimulatorData({
          ...vehicle_summary,
        });
        setLastestDayData(daily_summary.slice(-1)[0]);
        setAvgScore(vehicle_summary?.vehicle_safety_score);
        setOriginalAvgScore(vehicle_summary?.vehicle_safety_score);
        setPremiumSafetyScore(vehicle_summary?.vehicle_safety_score);
        setDailyScore(daily_summary);
        setFileHeadList(uploaded_csv_tab);
        setIsUploadSuccess(true);
      } else if (info.file.status === 'error') {
        setLoading(false);
        setIsUploadSuccess(false);
        setIsShowUploadList(false);
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const factorProps: UploadProps = {
    name: 'file',
    action: `${baseUrl}/api/upload_safety_score_factors`,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: checkFileType,
    onChange(info) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        console.log(info.file.response, 'info.file.response');
        message.success(`${info.file.name} file uploaded successfully`);
        getScoreFactor();
        setLoading(false);
      } else if (info.file.status === 'error') {
        setLoading(false);
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const profileProps: UploadProps = {
    name: 'file',
    action: ``,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const premiumFileUpload = async (options: any) => {
    setLoading(true);
    try {
      const { file } = options;
      setTimeout(() => {
        setPremiumFile({ fileName: file.name, fileUploadStatus: true, file: file });
        message.success(`${file.name} file uploaded successfully`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);

      setLoading(false);
    }
  };

  const getSimulatorScore = () => {
    getSimulator();
  };

  const backToSimulator = () => {
    setShowSimulator(true);
    setShowTable(false);
    setCurContent('table');
    setFactorCount(0);
  };

  // download score factor
  const getDownload = () => {
    window.open('https://sss-backend.novo.us/api/download'); // new window open
  };

  const download = () => {
    getDownload();
  };

  const backToSafetyScore = () => {
    setShowSimulator(true);
    setShowTable(true);
    setAvgScore(originalAvgScore);
    setDisount(originalDiscout);
    setSimulatorData(vehicleSummary);
    setCurContent('simulator');
  };

  const handleInputChange = (identifier: string, newValue: number) => {
    switch (identifier) {
      case 'hb_count':
        setSimulatorData({
          ...simulatorData,
          hb_count: newValue,
        });
        break;
      case 'ha_count':
        setSimulatorData({
          ...simulatorData,
          ha_count: newValue,
        });
        break;
      case 'sp_distance':
        setSimulatorData({
          ...simulatorData,
          sp_distance_above_85: newValue,
        });
        break;
      case 'trip':
        setSimulatorData({
          ...simulatorData,
          vehicle_mileage: newValue,
        });
        break;
      case 'driving_calender_days':
        setSimulatorData({
          ...simulatorData,
          driving_calender_days: newValue,
        });
        break;
      default:
        break;
    }
  };
  const safetyScoreClick = () => {
    if (curContent === 'simulator') {
      setShowSimulator(true);
      setShowTable(false);
      setCurContent('table');
    } else {
      setShowSimulator(false);
      setShowTable(true);
      setCurContent('simulator');
      getScoreFactor();
    }
  };

  const goToPremium = () => {
    setInitPremiumStatus(true);
    setIsUploadSuccess(true);
    setShowSimulator(false);
    setShowTable(false);
    setInitChartStatus(true);
    setIsShowUploadList(false);
  };
  const handleSubmit = () => {
    setIsShowUploadList(false);
    getDiscount(originalAvgScore);
  };
  return (
    <>
      {/* echarts */}
      {initChartStatus && (
        <div className={styles.displayWrapper}>
          {/* show echarts */}
          {showTable && showSimulator && (
            <>
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
                        Number(originalAvgScore.toFixed(2)) >= 0 ? styles.greenText : styles.redText
                      }`}
                    >
                      {originalAvgScore.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className={styles.title}>DISCOUNT</span>
                    <div
                      className={`${styles.disCount} ${
                        1 - originalDiscout >= 0 ? styles.greenText : styles.redText
                      }`}
                    >
                      {((1 - originalDiscout) * 100).toFixed(1)} %
                    </div>
                  </div>
                  {/* ss Version */}
                  <div className={styles.sVersion}>
                    <span className={styles.title}>SS VERSION: {ssVersion}</span>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Simulator Page */}
          {showSimulator && !showTable && (
            <>
              <div className={styles.safetyScoreChart}>
                <div className={styles.simulatorTitle}>SAFETY SCORE SIMULATOR</div>
                <div className={styles.simulatorContainer}>
                  {/*   driving_calender_days */}
                  <div className={styles.simulatorCount}>
                    <span className={styles.eventLabel}>DRIVING CALENDER DAYS </span>
                    <InputNumber
                      min={1}
                      defaultValue={simulatorData?.driving_calender_days}
                      onChange={(value) =>
                        handleInputChange('driving_calender_days', value as number)
                      }
                    />
                  </div>
                  {/*   hb_count */}
                  <div className={styles.simulatorCount}>
                    <span className={styles.eventLabel}>HARD BREAK COUNT </span>
                    <InputNumber
                      min={1}
                      defaultValue={simulatorData?.hb_count}
                      onChange={(value) => handleInputChange('hb_count', value as number)}
                    />
                  </div>
                  {/*   ha_count */}
                  <div className={styles.simulatorCount}>
                    <span className={styles.eventLabel}>HARD ACCELERATION COUNT </span>
                    <InputNumber
                      min={1}
                      defaultValue={simulatorData?.ha_count}
                      onChange={(value) => handleInputChange('ha_count', value as number)}
                    />
                  </div>
                  {/*  sp_distance_above_85 */}
                  <div className={styles.simulatorCount}>
                    <span className={styles.eventLabel}>SPEEDING DISTANCE (MILE) </span>
                    <InputNumber
                      min={1}
                      defaultValue={parseFloat(
                        (simulatorData?.sp_distance_above_85 || 0).toFixed(3),
                      )}
                      onChange={(value) => handleInputChange('sp_distance', value as number)}
                    />
                  </div>
                  {/*  vehicle_mileage*/}
                  <div className={styles.simulatorCount}>
                    <span className={styles.eventLabel}>TRIP MILEAGE </span>
                    <InputNumber
                      min={1}
                      defaultValue={parseFloat((simulatorData?.vehicle_mileage || 0).toFixed(3))}
                      onChange={(value) => handleInputChange('trip', value as number)}
                    />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <div className={styles.commonBtn}>
                      <Button className={styles.commonIconButton} onClick={getSimulatorScore}>
                        <span className={styles.commonButtonContent}>{'SIMULATE SCORE'}</span>
                        <span className={styles.iconWrapper}></span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
                        Number(avgScore.toFixed(2)) >= 0 ? styles.greenText : styles.redText
                      }`}
                    >
                      {avgScore.toFixed(2)}
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
                </div>
              </div>
            </>
          )}
          {/* Table List */}
          {!showSimulator && showTable && (
            <>
              <div id="chart-container" className={styles.safetyScoreChart}>
                <p className={styles.safetyScoreTitle} onClick={factorCountClick}>
                  SAFETY SCOE TABLE
                </p>
                <div>
                  <Table
                    columns={columns}
                    dataSource={scoreFactorData}
                    scroll={{ y: 310 }}
                    pagination={false}
                  />
                </div>
              </div>
            </>
          )}
          {/* Permium Page */}
          {!showSimulator && !showTable && initPremiumStatus && (
            <>
              <div className={styles.permiumSimulatorWrapper}>
                <p className={styles.safetyScoreTitle}>PREMIUM SIMULATOR</p>
                <div className={styles.premiumSimulatorContainer}>
                  <div className={styles.scoreContainer}>
                    <div className={styles.safetyScore}>
                      <span className={styles.eventLabel}>SAFETY SCORE</span>
                      <InputNumber
                        min={1}
                        defaultValue={Number(premiumSafetyScore.toFixed(2))}
                        onChange={(value) => premiumInputChange(value as number)}
                      />
                    </div>
                    <div className={styles.profile}>
                      <span className={styles.eventLabel}>PROFILE</span>
                      <div className={styles.profilePremium}>
                        <span className={styles.label}>FileName:</span>
                        <span className={styles.value}>{premiumFile.fileName}</span>
                      </div>
                      <div className={styles.profilePremium}>
                        <span className={styles.label}>Upload:</span>
                        <span className={styles.value}>
                          {premiumFile.fileUploadStatus ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.premiumContainer}>
                    <span className={styles.eventLabel}>PREMIUM</span>
                    <div className={styles.premiumPrice}>
                      <div className={styles.priceContaniner}>
                        <span className={styles.label}>Economy:</span>
                        <span className={styles.value}>$ {premiumData.Economy}</span>
                      </div>
                      <div className={styles.priceContaniner}>
                        <span className={styles.label}>Comfort:</span>
                        <span className={styles.value}>$ {premiumData.Comfort}</span>
                      </div>
                      <div className={styles.priceContaniner}>
                        <span className={styles.label}>Turbo:</span>
                        <span className={styles.value}>$ {premiumData.Turbo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* upload & submit */}
      <div className={styles.uploadFile}>
        {!initChartStatus && (
          <p className={styles.uploadFile_title}>
            {isShowUploadList
              ? 'File Selected'
              : 'BROWSE POLICY HOLDER’S PROFILE TO CALCULATE SCORE'}
          </p>
        )}

        {isShowUploadList && (
          <div className={styles.fileList}>
            <span className={styles.fileName}>FileName ：</span>
            {`[ ${fileName} ]`}
            <span className={styles.fileSize}>FileSize ：</span>
            {`${(fileSize / 1024).toFixed(0)}（KB）`}
            <div className={styles.schema}>
              <span className={styles.fileName}>Schema</span>
              <div className={styles.schema_content}>
                <Tables></Tables>
              </div>
            </div>
          </div>
        )}
        <div className={styles.uploadButtons}>
          {showSimulator && showTable && (
            <div className={styles.browserAll}>
              <Upload
                {...profileProps}
                className={styles.customUpload}
                maxCount={1}
                showUploadList={false}
              >
                <Button className={styles.customIconButton}>
                  <span className={styles.buttonContent}>
                    {isUploadSuccess ? 'BROWSE AGAIN' : 'BROWSE ALL'}
                  </span>
                  <span className={styles.iconWrapper}></span>
                </Button>
              </Upload>
            </div>
          )}
          {showSimulator && !showTable && (
            <div className={styles.customUpload}>
              <Button className={styles.customIconButton} onClick={backToSafetyScore}>
                <span className={styles.buttonContent}>{'BACK'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </div>
          )}
          {!showSimulator && showTable && (
            <>
              <div className={styles.customUpload}>
                <Button className={styles.customIconButton} onClick={backToSimulator}>
                  <span className={styles.buttonContent}>{'BACK'}</span>
                  <span className={styles.iconWrapper}></span>
                </Button>
              </div>
              <div className={styles.customUpload}>
                <Button className={styles.customIconButton} onClick={download}>
                  <span className={styles.buttonContent}>{'DOWNLOAD'}</span>
                  <span className={styles.iconWrapper}></span>
                </Button>
              </div>
              {factorCount >= 5 && (
                <div className={styles.customUpload}>
                  <Upload
                    {...factorProps}
                    className={styles.customUpload}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button className={styles.customIconButton}>
                      <span className={styles.buttonContent}>{'UPLOAD'}</span>
                      <span className={styles.iconWrapper}></span>
                    </Button>
                  </Upload>
                </div>
              )}
            </>
          )}
          {initChartStatus && showSimulator && (
            <>
              <div className={styles.customUpload}>
                <Button className={styles.customIconButton} onClick={safetyScoreClick}>
                  <span className={styles.buttonContent}>
                    {showSimulator && !showTable
                      ? 'VIEW SAFETY SCORE TABLE'
                      : 'SAFETY SCORE SIMULATOR'}
                  </span>
                  <span className={styles.iconWrapper}></span>
                </Button>
              </div>
            </>
          )}
          {showSimulator && !showTable && (
            <div className={styles.customUpload}>
              <Button className={styles.customIconButton} onClick={goToPremium}>
                <span className={styles.buttonContent}>{'PREMIUM SIMULATOR'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </div>
          )}
          {isUploadSuccess && !initChartStatus && (
            <div className={styles.customUpload}>
              <Button className={styles.customIconButton} onClick={handleSubmit}>
                <span className={styles.buttonContent}>{'SUBMIT'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </div>
          )}

          {!showSimulator && !showTable && initPremiumStatus && (
            <div className={styles.customUpload}>
              <Upload
                {...profileProps}
                className={styles.customUpload}
                maxCount={1}
                customRequest={premiumFileUpload}
                showUploadList={false}
              >
                <Button className={styles.customIconButton}>
                  <span className={styles.buttonContent}>{'BROWSER'}</span>
                  <span className={styles.iconWrapper}></span>
                </Button>
              </Upload>
            </div>
          )}
          {!showSimulator && !showTable && initPremiumStatus && (
            <div className={styles.customUpload}>
              <Button className={styles.customIconButton} onClick={getPremiumData}>
                <span className={styles.buttonContent}>{'CALCULATE PREMIUM'}</span>
                <span className={styles.iconWrapper}></span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OperateProfile;
