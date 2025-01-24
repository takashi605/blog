import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import playwrightHelper from './playwrightHelper.ts';

// タイムアウトを設定（必要に応じて調整）
setDefaultTimeout(60 * 1000); // 60秒

BeforeAll(async function () {
  console.log('BeforeAll: Launching browser');
  await playwrightHelper.launchBrowser();
});

AfterAll(async function () {
  console.log('AfterAll: Closing browser');
  await playwrightHelper.closeBrowser();
});
