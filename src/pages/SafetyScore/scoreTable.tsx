/* eslint-disable react/self-closing-comp */
import styles from './styles/index.less';
import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useHistory } from 'react-router-dom';
import { Table, message, Button } from 'antd';
import { fetchScoreFactor, getCustomData } from '../../services/safety-score/api';

type DataType = {
  key: React.Key;
  factor: number;
  safetyScore: number;
};

function ScoreTable(props: any) {
  const { onLoadingChange } = props;
  const history = useHistory();

  const [factorCount, setFactorCount] = useState(0);
  const [scoreFactorData, setScoreFactorData] = useState([]);

  // get score factor data
  const getScoreFactor = () => {
    onLoadingChange(true);
    fetchScoreFactor()
      .then((data) => {
        onLoadingChange(false);
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
        onLoadingChange(false);
        message.error(`${error.data.message}`);
      });
  };

  useEffect(() => {
    getScoreFactor();
  }, []);

  const getDownload = () => {
    window.open('https://sss-backend.novo.us/api/download'); // new window open
  };

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
  const factorCountClick = () => {
    setFactorCount(factorCount + 1);
  };

  const toScoreSimulator = () => {
    const customData = getCustomData();
    history.push({
      pathname: '/safetyScore/scoreSimulator',
      state: {
        simulatorData: customData.simulatorData,
        lastestDayData: customData.lastestDayData,
        ssVersion: customData.ssVersion,
        discount: customData.discount,
      },
    });
  };

  const downloadScoreFactor = () => {
    getDownload();
  };
  return (
    <>
      <div className={styles.displayWrapper}>
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
      </div>
      <div className={styles.uploadFile}>
        <div className={styles.uploadButtons}>
          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={toScoreSimulator}>
              <span className={styles.buttonContent}>{'BACK'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={downloadScoreFactor}>
              <span className={styles.buttonContent}>{'DOWNLOAD'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScoreTable;
