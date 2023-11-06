/* eslint-disable react/self-closing-comp */
import React, { useEffect, useState } from 'react';
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
import { Route, BrowserRouter as Router, Switch, useLocation, useHistory } from 'react-router-dom';
import BrowserProfile from './browseProfile';
import SelectProfile from './selectProfile';
import ScoreHistogram from './scoreHistogram';
import Premium from './premium';

export default function SafetyScore() {
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();

  const history = useHistory();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLoadingChange = (loadingStatus: boolean) => {
    setLoading(loadingStatus);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24, fontWeight: 600 }} spin />;

  useEffect(() => {}, [pathname]);

  const goToPremium = () => {
    // history.push({ pathname: '/safetyScore/premium' });
    history.push('/safetyScore/premium');
  };

  const goToBrowseProfile = () => {
    history.push({ pathname: '/safetyScore/browseProfile' });
  };

  return (
    <Router>
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
                    src={isActive('/safetyScore/browseProfile') ? stepOneActive : stepOne}
                    alt="browser profile"
                  />
                </div>
                <div className={styles.stepImage}>
                  <img
                    src={isActive('/safetyScore/selectProfile') ? stepTwoActive : stepTwo}
                    alt="browser profile"
                  />
                </div>
                <div className={styles.stepImage}>
                  <img
                    src={isActive('/safetyScore/scoreHistogram') ? stepThreeActive : stepThree}
                    alt="browser profile"
                  />
                </div>
                <div
                  className={`${styles.stepImage} ${styles.imageCanClick}`}
                  onClick={goToPremium}
                >
                  <img
                    src={isActive('/safetyScore/premium') ? stepFourActive : stepFour}
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
                <Route exact path="/safetyScore/premium" component={Premium} />
              </Switch>
            </div>
          </div>
        </Spin>
      </div>
    </Router>
  );
}
