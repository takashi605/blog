/**
 * API設定管理
 *
 * 環境変数からAPIのベースURLを取得し、共通のfetchオプションを提供します
 */

/**
 * APIのベースURLを取得
 * @throws {Error} 環境変数が設定されていない場合
 */
export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('環境変数 NEXT_PUBLIC_API_URL が設定されていません');
  }
  return apiUrl;
}

/**
 * 共通のfetchオプション
 */
export const defaultFetchOptions = {
  mode: 'cors' as const,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * タイムアウト設定（ミリ秒）
 */
export const DEFAULT_TIMEOUT = 30000; // 30秒

/**
 * リトライ設定
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1秒
  retryableStatuses: [408, 429, 500, 502, 503, 504],
} as const;
