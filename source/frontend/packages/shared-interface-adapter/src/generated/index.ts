/**
 * OpenAPI生成型のエクスポート
 *
 * このファイルは生成されたAPI型への統一されたアクセスポイントを提供します。
 * 直接api-types.tsをインポートせず、このファイル経由でアクセスしてください。
 */

// OpenAPI生成型をre-export
export type * from './api-types';

/**
 * 生成型の使用方法:
 *
 * @example
 * // APIレスポンス型の使用
 * import type { components } from '@/generated';
 * type BlogPost = components['schemas']['BlogPost'];
 *
 * @example
 * // APIエンドポイント型の使用
 * import type { paths } from '@/generated';
 * type GetBlogPostsResponse = paths['/api/blog/posts']['get']['responses']['200']['content']['application/json'];
 */
