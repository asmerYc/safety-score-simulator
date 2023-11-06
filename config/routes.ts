export default [
  {
    path: '/safetyScore',
    layout: false,
    name: 'safetyScore',
    component: './SafetyScore/safetyScore.tsx',
    routes: [
      {
        path: '/browseProfile',
        name: 'browseProfile',
        component: './SafetyScore/browseProfile.tsx',
      },
      {
        path: '/selectProfile',
        name: 'selectProfile',
        component: './SafetyScore/selectProfile.tsx',
      },
      {
        path: '/scoreHistogram',
        name: 'scoreHistogram',
        component: './SafetyScore/scoreHistogram.tsx',
      },
      {
        path: '/premium',
        name: 'premium',
        component: './SafetyScore/premium.tsx',
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
