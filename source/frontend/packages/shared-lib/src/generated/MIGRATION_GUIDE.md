# OpenAPI生成型への移行ガイド

## 移行戦略

### 段階的移行アプローチ

1. **並行実行期間** - 既存DTO型とOpenAPI生成型を両方維持
2. **エンドポイント別移行** - 各APIエンドポイントごとに順次移行
3. **既存型削除** - 全移行完了後に手動定義されたDTO型を削除

### 移行対象の型

#### 現在の構造

```
service/src/
├── blogPostService/dto/
│   ├── blogPostDTO.ts        → OpenAPI: components.schemas.BlogPost
│   └── contentDTO.ts         → OpenAPI: components.schemas.Content*
└── imageService/dto/
    └── imageDTO.ts           → OpenAPI: components.schemas.Image
```

#### 移行後の構造

```
shared-interface-adapter/src/generated/
├── api-types.ts             # OpenAPI自動生成ファイル
├── index.ts                 # 型エクスポート
└── adapters/                # 型アダプター（必要時）
    ├── blogPostAdapter.ts
    └── imageAdapter.ts
```

## 移行手順

### 1. API型の置き換え

**移行前:**

```typescript
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

const blogPost: BlogPostDTO = response.data;
```

**移行後:**

```typescript
import type { components } from '@/generated';

type BlogPost = components['schemas']['BlogPost'];
const blogPost: BlogPost = response.data;
```

### 2. APIエンドポイント型の利用

**移行前:**

```typescript
// APIレスポンス型を手動定義
type GetBlogPostsResponse = {
  data: BlogPostDTO[];
  meta: { total: number };
};
```

**移行後:**

```typescript
import type { paths } from '@/generated';

// OpenAPIから自動生成された型を使用
type GetBlogPostsResponse =
  paths['/api/blog/posts']['get']['responses']['200']['content']['application/json'];
```

### 3. リクエスト型の利用

**移行前:**

```typescript
type CreateBlogPostRequest = {
  title: string;
  contents: ContentDTO[];
};
```

**移行後:**

```typescript
import type { paths } from '@/generated';

type CreateBlogPostRequest =
  paths['/api/blog/posts']['post']['requestBody']['content']['application/json'];
```

## 型アダプターパターン

既存のドメインオブジェクトとAPI型が異なる場合のアダプター：

```typescript
// adapters/blogPostAdapter.ts
import type { components } from '@/generated';
import type { BlogPost as DomainBlogPost } from 'entities/src/blogPost';

type ApiBlogPost = components['schemas']['BlogPost'];

export const blogPostAdapter = {
  toDomain: (api: ApiBlogPost): DomainBlogPost => {
    // API型 → ドメイン型変換
  },
  toApi: (domain: DomainBlogPost): ApiBlogPost => {
    // ドメイン型 → API型変換
  },
};
```

## 移行チェックリスト

### エンドポイント別移行状況

- [ ] **GET /api/blog/posts** - ブログ記事一覧取得
- [ ] **GET /api/blog/posts/:id** - ブログ記事詳細取得
- [ ] **POST /api/blog/posts** - ブログ記事作成
- [ ] **PUT /api/blog/posts/:id** - ブログ記事更新
- [ ] **GET /api/images** - 画像一覧取得
- [ ] **POST /api/images** - 画像アップロード

### ファイル別移行状況

#### shared-interface-adapter

- [ ] `repositories/apiBlogPostRepository/index.ts`
- [ ] `repositories/apiBlogPostRepository/jsonMapper/blogPostSchema.ts`
- [ ] `repositories/apiImageRepository/index.ts`
- [ ] `repositories/apiImageRepository/jsonMapper/imageSchema.ts`

#### APIモック

- [ ] `apiMocks/handlers/blogPost/blogPostHandlers.ts`
- [ ] `apiMocks/handlers/image/imageHandler.ts`

## 削除予定ファイル

移行完了後に削除する手動定義型：

- `service/src/blogPostService/dto/`
- `service/src/imageService/dto/`
- `shared-interface-adapter/src/repositories/*/jsonMapper/*Schema.ts`

## 注意事項

1. **型の互換性確認** - 既存型とOpenAPI生成型の互換性を事前に確認
2. **テストの更新** - 型変更に伴うテストコードの修正
3. **段階的リリース** - 一度に全て移行せず、エンドポイント単位で検証
