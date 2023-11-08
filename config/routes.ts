export default [
  {
    path: '/safetyScore',
    layout: false,
    name: 'safetyScore',
    component: './SafetyScore/safetyScore',
    routes: [
      {
        path: '/browseProfile',
        name: 'browseProfile',
        component: './SafetyScore/browseProfile',
      },
      {
        path: '/selectProfile',
        name: 'selectProfile',
        component: './SafetyScore/selectProfile',
      },
      {
        path: '/scoreHistogram',
        name: 'scoreHistogram',
        component: './SafetyScore/scoreHistogram',
      },
      {
        path: '/scoreSimulator',
        name: 'scoreSimulator',
        component: './SafetyScore/scoreSimulator',
      },
      {
        path: '/scoreTable',
        name: 'scoreTable',
        component: './SafetyScore/scoreTable',
      },
      {
        path: '/premiumSimulator',
        name: 'premiumSimulator',
        component: './SafetyScore/premiumSimulator',
      },
    ],
  },
  {
    path: '/',
    redirect: '/safetyScore/browseProfile',
  },
  {
    component: './404',
  },
];
