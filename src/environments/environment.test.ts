// src\environments\environment.ts
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://helpempowerment.com/api',
  mailServiceId: "service_qa9ozck",
  mailTemolateId: "template_1sqbwoa",
  resetTemolateId: "template_ye2kx3n",

  mailPublicKey: "o3-i7ksFLJZT2C6GV",
  // baseUrl:"http://localhost:5075/api",
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
