export default [
  {
    path: '/safetyScore',
    layout: false,
    name: 'safetyScore',
    component: './SafetyScore',
  },
  {
    path: '/',
    redirect: '/safetyScore',
  },
  {
    component: './404',
  },
];
