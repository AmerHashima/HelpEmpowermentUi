// src\environments\environment.prod.ts
export const environment = {
  production: true,
  // baseUrl: 'http://144.91.127.150:8080/api',
  // baseUrl: "http://localhost:5075/api",
  baseUrl: 'http://144.91.127.150:8081/api',
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
