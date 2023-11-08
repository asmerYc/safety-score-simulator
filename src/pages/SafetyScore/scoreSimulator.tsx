/* eslint-disable react/self-closing-comp */
import { useState } from 'react';
import styles from './styles/index.less';
import { Button, message, InputNumber } from 'antd';
import { fetchDiscount, initialCustomData } from '../../services/safety-score/api';
import { useLocation, useHistory } from 'react-router-dom';
import { fetchSimulator, getFileData } from '../../services/safety-score/api';
import type { SimulatorData } from '../../services/safety-score/type';

function ScoreSimulator(props: any) {
  const location = useLocation();
  const history = useHistory();
  const { simulatorData, lastestDayData, ssVersion, discount } = location.state as any;
  const [curDiscout, setCurDiscout] = useState(discount);
  const [avgScore, setAvgScore] = useState(simulatorData?.vehicle_safety_score);
  const [curSimulatorData, setCurSimulatorData] = useState<SimulatorData>(simulatorData);
  const { onLoadingChange } = props;

  // get discount data
  const getDiscount = (avg_score: number) => {
    fetchDiscount(avg_score)
      .then((data) => {
        setCurDiscout(data.discount_rate);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
      });
  };
  // get simulator data
  const getSimulator = () => {
    onLoadingChange(true);
    fetchSimulator(curSimulatorData)
      .then((data) => {
        setAvgScore(data.daily_score);
        getDiscount(data.daily_score);
        onLoadingChange(false);
      })
      .catch((error) => {
        onLoadingChange(false);
        message.error(
          `Error fetching user info: float division by zero, Please write valid count data}`,
        );
      });
  };
  const getSimulatorScore = () => {
    getSimulator();
  };
  const handleInputChange = (identifier: string, newValue: number) => {
    switch (identifier) {
      case 'hb_count':
        setCurSimulatorData({
          ...curSimulatorData,
          hb_count: newValue,
        });
        break;
      case 'ha_count':
        setCurSimulatorData({
          ...curSimulatorData,
          ha_count: newValue,
        });
        break;
      case 'sp_distance':
        setCurSimulatorData({
          ...curSimulatorData,
          sp_distance_above_85: newValue,
        });
        break;
      case 'trip':
        setCurSimulatorData({
          ...curSimulatorData,
          vehicle_mileage: newValue,
        });
        break;
      case 'driving_calender_days':
        setCurSimulatorData({
          ...curSimulatorData,
          driving_calender_days: newValue,
        });
        break;
      default:
        break;
    }
  };

  // buttons routes click
  const toScoreTable = () => {
    const customData = {
      simulatorData: curSimulatorData,
      lastestDayData: lastestDayData,
      ssVersion: ssVersion,
      discount: curDiscout,
    };
    initialCustomData(customData);
    history.push('/safetyScore/scoreTable');
  };

  const toPremium = () => {
    history.push(`/safetyScore/premiumSimulator?avgScore=${avgScore}`);
  };

  const toScoreHistogram = () => {
    const fileData = getFileData();
    history.push({
      pathname: '/safetyScore/scoreHistogram',
      state: {
        simulatorData: simulatorData,
        lastestDayData: fileData.lastestDayData,
        ssVersion: fileData.ssVersion,
        dailyScore: fileData.dailyScore,
      },
    });
  };
  return (
    <>
      <div className={styles.displayWrapper}>
        <div className={styles.safetyScoreChart}>
          <div className={styles.simulatorTitle}>SAFETY SCORE SIMULATOR</div>
          <div className={styles.simulatorContainer}>
            {/*   ha_count */}
            <div className={styles.simulatorCount}>
              <span className={styles.eventLabel}>HARD ACCELERATION COUNT </span>
              <InputNumber
                min={1}
                defaultValue={simulatorData?.ha_count}
                onChange={(value) => handleInputChange('ha_count', value as number)}
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
            {/*  sp_distance_above_85 */}
            <div className={styles.simulatorCount}>
              <span className={styles.eventLabel}>SPEEDING DISTANCE (MILE) </span>
              <InputNumber
                min={1}
                defaultValue={parseFloat((simulatorData?.sp_distance_above_85 || 0).toFixed(3))}
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
                  1 - curDiscout >= 0 ? styles.greenText : styles.redText
                }`}
              >
                {((1 - curDiscout) * 100).toFixed(1)} %
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
          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={toScoreHistogram}>
              <span className={styles.buttonContent}>{'BACK'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={toScoreTable}>
              <span className={styles.buttonContent}>{'VIEW SAFETY SCORE TABLE'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={toPremium}>
              <span className={styles.buttonContent}>{'PREMIUM SIMULATOR'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScoreSimulator;
