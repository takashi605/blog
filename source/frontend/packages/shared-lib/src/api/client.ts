/**
 * HTTPクライアント基盤
 *
 * 型安全なfetchラッパーとエラーハンドリングを提供します
 */

import { HttpError } from '../error/httpError';
import type { paths } from '../generated/api-types';
import {
  DEFAULT_TIMEOUT,
  RETRY_CONFIG,
  defaultFetchOptions,
  getApiUrl,
  normalizeApiPath,
} from './config';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * パスからメソッドの型を取得
 */
type PathMethod<
  Path extends keyof paths,
  Method extends HttpMethod,
> = paths[Path][Method];

/**
 * パスパラメータの型を取得
 */
type PathParams<Path extends keyof paths, Method extends HttpMethod> =
  PathMethod<Path, Method> extends {
    parameters?: { path?: infer Params };
  }
    ? Params
    : never;

/**
 * リクエストボディの型を取得
 */
type RequestBody<Path extends keyof paths, Method extends HttpMethod> =
  PathMethod<Path, Method> extends {
    requestBody?: { content: { 'application/json': infer Body } };
  }
    ? Body
    : never;

/**
 * レスポンスボディの型を取得
 */
type ResponseBody<Path extends keyof paths, Method extends HttpMethod> =
  PathMethod<Path, Method> extends {
    responses: {
      200: { content: { 'application/json': infer Body } };
    };
  }
    ? Body
    : never;

/**
 * クエリパラメータの型を取得
 */
type QueryParams<Path extends keyof paths, Method extends HttpMethod> =
  PathMethod<Path, Method> extends {
    parameters?: { query?: infer Query };
  }
    ? Query
    : never;

/**
 * APIクライアントのオプション
 */
export interface ApiClientOptions<
  Path extends keyof paths,
  Method extends HttpMethod,
> {
  path: Path;
  method: Method;
  body?: RequestBody<Path, Method>;
  query?: QueryParams<Path, Method>;
  pathParams?: PathParams<Path, Method>;
  signal?: AbortSignal;
  customHeaders?: Record<string, string>;
}

/**
 * APIクライアントのエントリポイント
 * 各HTTPメソッドに対応する関数を提供します
 * apiClient をそのまま使用することも可能ですが、
 * こちらの関数を使用することで、より型安全にAPIを呼び出すことができます
 */
export const api = {
  /**
   * GETリクエストを送信します
   * @param path APIのパス
   * @param options オプション
   */
  get<Path extends keyof paths>(
    path: Path,
    options?: Omit<ApiClientOptions<Path, 'get'>, 'path' | 'method'>,
  ) {
    return apiClient({ ...options, path, method: 'get' } as ApiClientOptions<
      Path,
      'get'
    >);
  },

  /**
   * POSTリクエストを送信します
   * @param path APIのパス
   * @param body リクエストボディ
   * @param options オプション
   */
  post<Path extends keyof paths>(
    path: Path,
    body: RequestBody<Path, 'post'>,
    options?: Omit<ApiClientOptions<Path, 'post'>, 'path' | 'method' | 'body'>,
  ) {
    return apiClient({
      ...options,
      path,
      method: 'post',
      body,
    } as ApiClientOptions<Path, 'post'>);
  },

  /**
   * PUTリクエストを送信します
   * @param path APIのパス
   * @param body リクエストボディ
   * @param options オプション
   */
  put<Path extends keyof paths>(
    path: Path,
    body: RequestBody<Path, 'put'>,
    options?: Omit<ApiClientOptions<Path, 'put'>, 'path' | 'method' | 'body'>,
  ) {
    return apiClient({
      ...options,
      path,
      method: 'put',
      body,
    } as ApiClientOptions<Path, 'put'>);
  },

  /**
   * DELETEリクエストを送信します
   * @param path APIのパス
   * @param options オプション
   */
  delete<Path extends keyof paths>(
    path: Path,
    options?: Omit<ApiClientOptions<Path, 'delete'>, 'path' | 'method'>,
  ) {
    return apiClient({ ...options, path, method: 'delete' } as ApiClientOptions<
      Path,
      'delete'
    >);
  },
};

/**
 * APIクライアント
 */
export async function apiClient<
  Path extends keyof paths,
  Method extends HttpMethod,
>(
  options: ApiClientOptions<Path, Method>,
): Promise<ResponseBody<Path, Method>> {
  const { path, method, body, query, pathParams, signal, customHeaders } =
    options;

  const baseUrl = getApiUrl();
  const normalizedPath = normalizeApiPath(path as string);
  const pathWithParams = buildUrlWithPathParams(normalizedPath, pathParams);
  const url = buildUrlWithQuery(`${baseUrl}${pathWithParams}`, query);

  const fetchOptions: RequestInit = {
    ...defaultFetchOptions,
    method: method.toUpperCase(),
    signal,
    cache: 'no-store',
    headers: {
      ...defaultFetchOptions.headers,
      ...customHeaders,
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetchWithRetry(url, fetchOptions);

  // エラーレスポンスの処理
  if (!response.ok) {
    const errorMessage = await extractErrorMessage(response);
    throw new HttpError(errorMessage, response.status);
  }

  // 204 No Contentの場合
  if (response.status === 204) {
    return undefined as ResponseBody<Path, Method>;
  }

  // JSONレスポンスのパース
  try {
    const data = await response.json();
    return data as ResponseBody<Path, Method>;
  } catch (error) {
    throw new Error('レスポンスのパースに失敗しました');
  }
}

/**
 * 以下、上記のコードで使用されるユーティリティ関数
 */

/**
 * エラーレスポンスからエラーメッセージを抽出
 * @param response エラーレスポンス
 * @returns エラーメッセージ
 */
async function extractErrorMessage(response: Response): Promise<string> {
  // レスポンスをクローンして複数回読めるようにする
  const clonedResponse = response.clone();

  try {
    // まずJSONとしてパースを試みる
    const errorData = await response.json();
    return errorData.message || errorData.error || JSON.stringify(errorData);
  } catch {
    // JSONパースに失敗した場合はテキストとして扱う
    try {
      return await clonedResponse.text();
    } catch {
      return `APIリクエストが失敗しました: ${response.statusText}`;
    }
  }
}

/**
 * タイムアウト付きfetch
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * リトライロジック
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = RETRY_CONFIG.maxRetries,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);

      // リトライ可能なステータスコードの場合
      if (
        i < retries &&
        RETRY_CONFIG.retryableStatuses.includes(
          response.status as (typeof RETRY_CONFIG.retryableStatuses)[number],
        )
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_CONFIG.retryDelay * (i + 1)),
        );
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // 最後のリトライでなければ待機
      if (i < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_CONFIG.retryDelay * (i + 1)),
        );
      }
    }
  }

  throw lastError || new Error('予期しないエラーが発生しました');
}

/**
 * オブジェクトかどうかを型安全に判定する型ガード
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * パスパラメータをURLに埋め込む
 */
function buildUrlWithPathParams(path: string, pathParams?: unknown): string {
  if (!isRecord(pathParams)) {
    return path;
  }

  let resultPath = path;
  Object.entries(pathParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      resultPath = resultPath.replace(`{${key}}`, String(value));
    }
  });

  return resultPath;
}

/**
 * URLにクエリパラメータを追加
 */
function buildUrlWithQuery(path: string, query?: unknown): string {
  if (!isRecord(query) || Object.keys(query).length === 0) {
    return path;
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return `${path}?${params.toString()}`;
}
