import type { Browser, BrowserContext, Page } from '@playwright/test';
import { chromium } from '@playwright/test';

class PlaywrightHelper {
  private static instance: PlaywrightHelper;
  private browser!: Browser;
  private context!: BrowserContext;
  private page!: Page;

  private constructor() {}

  public static getInstance(): PlaywrightHelper {
    if (!PlaywrightHelper.instance) {
      PlaywrightHelper.instance = new PlaywrightHelper();
    }
    return PlaywrightHelper.instance;
  }

  public async launchBrowser() {
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      permissions: [],
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();

    // 不要なリクエストをブロック
    await this.page.route(
      '**/*.{png,jpg,jpeg,css,woff,woff2,svg,ico}',
      (route) => route.abort(),
    );

    // デバッグ用のコンソールログとページエラーのキャプチャ
    // 基本はコメントアウト
    // this.page.on('console', (msg) =>
    //   console.log(`Console Log: ${msg.type()} - ${msg.text()}`),
    // );
    // this.page.on('pageerror', (error) =>
    //   console.log(`Page Error: ${error.message}`),
    // );
  }

  public async closeBrowser() {
    await this.browser.close();
  }

  public getPage(): Page {
    return this.page;
  }
}

export default PlaywrightHelper.getInstance();
