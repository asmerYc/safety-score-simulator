/* eslint-disable react/self-closing-comp */
import { useEffect, useState } from 'react';
import styles from './styles/index.less';
import type { UploadProps } from 'antd';
import { useLocation } from 'react-router-dom';
import { Button, Upload, message, InputNumber } from 'antd';
import { fetchPremiumData } from '../../services/safety-score/api';

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
function PremiumSimulator(props: any) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const score: number = Number(searchParams.get('avgScore')) ?? 0;

  const [premiumSafetyScore, setPremiumSafetyScore] = useState(score);
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

  const { onLoadingChange } = props;

  useEffect(() => {}, []);

  const premiumInputChange = (value: number) => {
    setPremiumSafetyScore(value);
  };

  const profileProps: UploadProps = {
    name: 'file',
    action: ``,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      onLoadingChange(true);
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        onLoadingChange(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.response.error}`);
      }
    },
  };

  const getPremiumData = () => {
    if (premiumFile.fileName && premiumFile.fileUploadStatus && premiumSafetyScore > 0) {
      onLoadingChange(true);
      fetchPremiumData(premiumFile.file, premiumSafetyScore)
        .then((data) => {
          onLoadingChange(false);
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
          onLoadingChange(false);
        });
    } else {
      message.warning('Please upload the file and add the safety score first');
      onLoadingChange(false);
    }
  };

  const premiumFileUpload = async (options: any) => {
    onLoadingChange(true);
    try {
      const { file } = options;
      setTimeout(() => {
        setPremiumFile({ fileName: file.name, fileUploadStatus: true, file: file });
        message.success(`${file.name} file uploaded successfully`);
        onLoadingChange(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);

      onLoadingChange(false);
    }
  };
  return (
    <>
      <div className={styles.displayWrapper}>
        <div className={styles.permiumSimulatorWrapper}>
          <p className={styles.safetyScoreTitle}>PREMIUM SIMULATOR</p>
          <div className={styles.premiumSimulatorContainer}>
            <div className={styles.scoreContainer}>
              <div className={styles.safetyScore}>
                <span className={styles.eventLabel}>SAFETY SCORE</span>
                <InputNumber
                  min={1}
                  defaultValue={Number(premiumSafetyScore?.toFixed(2))}
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
      </div>
      <div className={styles.uploadFile}>
        <div className={styles.uploadButtons}>
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

          <div className={styles.customUpload}>
            <Button className={styles.customIconButton} onClick={getPremiumData}>
              <span className={styles.buttonContent}>{'CALCULATE PREMIUM'}</span>
              <span className={styles.iconWrapper}></span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PremiumSimulator;
