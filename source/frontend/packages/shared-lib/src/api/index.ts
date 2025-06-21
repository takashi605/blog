/**
 * APIクライアントのエクスポート
 *
 * 各機能ディレクトリのカスタムフックから使用するAPIクライアント機能を提供します
 */

// HTTPクライアント
export { api, apiClient } from './client';
export type { ApiClientOptions } from './client';

// 設定
export {
  DEFAULT_TIMEOUT,
  RETRY_CONFIG,
  defaultFetchOptions,
  getApiUrl,
} from './config';

// エラークラス（既存のものを再エクスポート）
export { HttpError } from '../error/httpError';

// 生成された型（便利のため再エクスポート）
export type { components, paths } from '../generated/api-types';
