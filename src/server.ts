// src\server.ts
// import { CommonEngine, isMainModule } from '@angular/ssr/node';
// import express from 'express';
// import { dirname, join, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';
// import bootstrap from './main.server';

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, '../browser');
// const indexHtml = join(serverDistFolder, 'index.server.html');

// const app = express();
// const commonEngine = new CommonEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.get(
//   '**',
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: 'index.html'
//   }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.get('**', (req, res, next) => {
//   const { protocol, originalUrl, baseUrl, headers } = req;

//   commonEngine
//     .render({
//       bootstrap,
//       documentFilePath: indexHtml,
//       url: `${protocol}://${headers.host}${originalUrl}`,
//       publicPath: browserDistFolder,
//       providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
//     })
//     .then((html) => res.send(html))
//     .catch((err) => next(err));
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4000;
//   app.listen(port, () => {
//     //console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }


import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: 0,
    index: 'index.html',
    setHeaders: (res, filePath) => {
      // Angular production bundles contain a content hash, so they are safe to
      // cache forever. Never give unhashed HTML/JS/CSS a year-long lifetime:
      // real mobile browsers can otherwise keep running an obsolete app after
      // a deployment, while a fresh Playwright profile appears to work.
      const isHashedAsset = /-[a-z0-9]{8,}\.(?:js|css)$/i.test(filePath);

      if (isHashedAsset) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    },
  })
);

app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap, // <-- the root component class
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      inlineCriticalCss: false,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.send(html);
    })
    .catch((err) => next(err));
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    //console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
