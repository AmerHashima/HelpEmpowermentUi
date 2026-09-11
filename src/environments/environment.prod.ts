// src\environments\environment.prod.ts
export const environment = {
  production: true,
  baseUrl: 'http://localhost:5208/api',
  // baseUrl: "http://localhost:5075/api",

  //baseUrl: 'https://helpempowerment.com/api',
  telrAllowedHosts: ['secure.telr.com'],
  firebase: {
    apiKey: '********************************',
    authDomain: '********************************',
    projectId: '********************************',
    storageBucket: '********************************',
    messagingSenderId: '********************************',
    appId: '********************************',
    measurementId: '********************************',
  },
};
