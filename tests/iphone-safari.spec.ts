import { test } from '@playwright/test';

test('manual iPhone Safari interaction diagnostics', async ({ page }) => {
  test.setTimeout(0);

  page.on('console', (message) => {
    if (message.type() === 'error') {
      console.error(`[browser console.error] ${message.text()}`);
      return;
    }

    if (message.text().startsWith('[interaction]')) {
      console.log(`[browser ${message.type()}] ${message.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    console.error(`[browser page error] ${error.stack ?? error.message}`);
  });

  page.on('requestfailed', (request) => {
    console.error(
      `[failed request] method=${request.method()} url=${request.url()} reason=${request.failure()?.errorText ?? 'unknown'}`,
    );
  });

  await page.addInitScript(() => {
    const diagnosticEvents = [
      'click',
      'touchstart',
      'touchend',
      'pointerdown',
      'pointerup',
      'pointermove',
      'pointercancel',
    ];

    const describeTarget = (event: Event) => {
      const target = event.composedPath()[0];
      const element = target instanceof Element ? target : null;
      const point = event instanceof TouchEvent
        ? event.changedTouches[0] ?? event.touches[0]
        : event instanceof MouseEvent
          ? event
          : null;

      const text = element?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 160) ?? '';

      console.log('[interaction] ' + JSON.stringify({
        event: event.type,
        tag: element?.tagName.toLowerCase() ?? '',
        id: element?.id ?? '',
        class: element?.getAttribute('class') ?? '',
        text,
        x: point?.clientX ?? null,
        y: point?.clientY ?? null,
      }));
    };

    for (const eventName of diagnosticEvents) {
      document.addEventListener(eventName, describeTarget, {
        capture: true,
        passive: true,
      });
    }
  });

  await page.goto('https://helpempowerment.com', {
    waitUntil: 'domcontentloaded',
  });

  console.log('[manual test] Website loaded. Interact with the WebKit window; resume or close it when finished.');
  await page.pause();
});
