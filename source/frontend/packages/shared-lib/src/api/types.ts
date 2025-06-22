/**
 * よく使用されるOpenAPI型のエイリアス
 *
 * components['schemas']['BlogPost'] のような冗長な型定義を避けるため、
 * よく使用される型のエイリアスを提供します
 */

import type { components, paths } from '../generated/api-types';

// よく使用されるエンティティ型
export type BlogPost = components['schemas']['BlogPost'];
export type Image = components['schemas']['Image'];
export type BlogPostContent = components['schemas']['BlogPostContent'];

// よく使用されるリクエスト型
export type CreateBlogPostRequest =
  paths['/api/admin/blog/posts']['post']['requestBody']['content']['application/json'];
export type RegisterImageRequest =
  paths['/api/admin/blog/images']['post']['requestBody']['content']['application/json'];

// よく使用されるレスポンス型
export type BlogPostListResponse =
  paths['/api/blog/posts/latest']['get']['responses']['200']['content']['application/json'];
export type ImageListResponse =
  paths['/api/blog/images']['get']['responses']['200']['content']['application/json'];

// 特殊用途型
export type PickUpPostsRequest =
  paths['/api/admin/blog/posts/pickup']['put']['requestBody']['content']['application/json'];
export type PopularPostsRequest =
  paths['/api/admin/blog/posts/popular']['put']['requestBody']['content']['application/json'];
export type TopTechPickRequest =
  paths['/api/admin/blog/posts/top-tech-pick']['put']['requestBody']['content']['application/json'];
