/* eslint-disable react/self-closing-comp */
import { useEffect, useState } from 'react';
import styles from './styles/index.less';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import stepOne from '../../../public/assets/stepOne.png';
import stepOneActive from '../../../public/assets/stepOneActive.png';
import stepTwo from '../../../public/assets/stepTwo.png';
import stepTwoActive from '../../../public/assets/stepTwoActive.png';
import stepThree from '../../../public/assets/stepThree.png';
import stepThreeActive from '../../../public/assets/stepThreeActive.png';
import stepFour from '../../../public/assets/stepFour.png';
import stepFourActive from '../../../public/assets/stepFourActive.png';
import logo from '../../../public/assets/Logo.png';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import BrowserProfile from './browseProfile';
import SelectProfile from './selectProfile';
import ScoreHistogram from './scoreHistogram';
import ScoreSimulator from './scoreSimulator';
import PremiumSimulator from './premiumSimulator';
import ScoreTable from './scoreTable';

export default function SafetyScore() {
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();

  const history = useHistory();

  const isActive = (paths: string[]) => {
    return paths.some((path) => location.pathname === path);
  };

  const handleLoadingChange = (loadingStatus: boolean) => {
    setLoading(loadingStatus);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24, fontWeight: 600 }} spin />;

  useEffect(() => {}, [pathname]);

  const goToPremium = () => {
    history.push('/safetyScore/premiumSimulator');
  };

  const goToBrowseProfile = () => {
    history.push({ pathname: '/safetyScore/browseProfile' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Spin tip="Loading" spinning={loading} style={{ color: '#00ff00' }} indicator={antIcon}>
        <div className={`${styles.wrapper}`}>
          <div className={styles.guide}>
            <div className={styles.logoWrapper}>
              <img className={styles.logo} src={logo} alt="NOVO" />
            </div>
            <div className={styles.guideSteps}>
              <div
                className={`${styles.stepImage} ${styles.imageCanClick}`}
                onClick={goToBrowseProfile}
              >
                <img
                  src={isActive(['/safetyScore/browseProfile']) ? stepOneActive : stepOne}
                  alt="browser profile"
                />
              </div>
              <div className={styles.stepImage}>
                <img
                  src={isActive(['/safetyScore/selectProfile']) ? stepTwoActive : stepTwo}
                  alt="browser profile"
                />
              </div>
              <div className={styles.stepImage}>
                <img
                  src={
                    isActive([
                      '/safetyScore/scoreHistogram',
                      '/safetyScore/scoreSimulator',
                      '/safetyScore/scoreTable',
                    ])
                      ? stepThreeActive
                      : stepThree
                  }
                  alt="browser profile"
                />
              </div>
              <div className={`${styles.stepImage} ${styles.imageCanClick}`} onClick={goToPremium}>
                <img
                  src={isActive(['/safetyScore/premiumSimulator']) ? stepFourActive : stepFour}
                  alt="browser profile"
                />
              </div>
            </div>
            <div className={styles.copyRight}>
              <p>
                © 2023<span className={styles.projectName}> Novo Insurance</span>,<br />{' '}
                <span>LLC.All Rights Reserved.</span>
              </p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.dashboardHeader}>
              <h1 className={styles.title}>Score & Rating Dashboard</h1>
              <p className={styles.paragraph}>
                Find and calculate a Novo policy holder’s safety score and risk factor
              </p>
            </div>
            <Switch>
              <Route
                path="/safetyScore/browseProfile"
                exact
                key="browseProfile"
                render={(props) => (
                  <BrowserProfile
                    {...props}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                  />
                )}
              ></Route>
              <Route
                path="/safetyScore/selectProfile"
                key="selectProfile"
                render={(props) => (
                  <SelectProfile
                    {...props}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                  />
                )}
              ></Route>
              <Route
                path="/safetyScore/scoreHistogram"
                key="scoreHistogram"
                render={(props) => (
                  <ScoreHistogram
                    {...props}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                  />
                )}
              ></Route>
              <Route
                path="/safetyScore/scoreSimulator"
                key="scoreHistogram"
                render={(props) => (
                  <ScoreSimulator
                    {...props}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                  />
                )}
              ></Route>
              <Route
                path="/safetyScore/scoreTable"
                key="scoreTable"
                render={(props) => (
                  <ScoreTable {...props} loading={loading} onLoadingChange={handleLoadingChange} />
                )}
              ></Route>
              <Route
                path="/safetyScore/premiumSimulator"
                key="premium"
                render={(props) => (
                  <PremiumSimulator
                    {...props}
                    loading={loading}
                    onLoadingChange={handleLoadingChange}
                  />
                )}
              ></Route>
            </Switch>
          </div>
        </div>
      </Spin>
    </div>
  );
}
