# フロントエンド開発ガイド

このファイルはフロントエンド開発に関する情報を集約しています。

## フロントエンド構造

PNPM ワークスペース構成のパッケージ:

- **`web/`** - 公開ブログインターフェース（Next.js）
- **`blog-admin/`** - コンテンツ管理用管理画面（Next.js）
- **`e2e/`** - Playwright E2E テスト
- **`entities/`, `service/`, `shared-interface-adapter/`** - ドメインロジックパッケージ
- **`shared-test-data/`** - テストユーティリティ

## フロントエンド開発コマンド

```bash
# 依存関係インストール
make frontend-install

# フロントエンド全体チェック（TypeScript、テスト、リンティング）
make frontend-test

# 個別フロントエンドコマンド
make frontend-tsc          # TypeScriptチェック
make frontend-test-unit    # 単体テスト
make frontend-check        # 全パッケージのリンティング
make frontend-fix          # リンティング問題の自動修正

# PNPM経由のパッケージ固有コマンド
cd source/frontend && pnpm web run dev         # Web開発サーバー
cd source/frontend && pnpm blog-admin run dev  # 管理画面開発サーバー
```

## 型生成システム

OpenAPI 仕様書ベースの型自動生成により、バックエンド・フロントエンド間の型安全性を確保：

```bash
# 型生成（一括実行）
make generate-types

# 個別実行
make api-generate-openapi    # OpenAPI仕様書生成
make frontend-generate-types # TypeScript型生成
```

### 使用方法

```typescript
// 生成された型のインポート
import type { components, paths } from '@/generated';

// スキーマ型の使用
type BlogPost = components['schemas']['BlogPost'];
type Image = components['schemas']['Image'];

// APIエンドポイント型の使用
type GetBlogPostsResponse = 
  paths['/api/blog/posts/latest']['get']['responses']['200']['content']['application/json'];

type CreateBlogPostRequest = 
  paths['/api/admin/blog/posts']['post']['requestBody']['content']['application/json'];
```

### 重要事項

- **自動生成ファイル:** `source/frontend/packages/shared-interface-adapter/src/generated/api-types.ts` は手動編集禁止
- **Git管理:** 生成ファイルはGit管理対象です。バックエンドAPI変更時は `make generate-types` 実行後にコミット
- **型更新:** バックエンド API 変更後は必ず `make generate-types` を実行してから変更をコミット
- **統一エクスポート:** `@/generated` からのインポートを使用し、直接 `api-types.ts` をインポートしない

## フロントエンドアクセス

- **公開サイト:** `blog.example`
- **管理画面:** `admin.blog.example`

## 開発時の重要事項

- **フロントエンドワークスペース:** `/source/frontend/` ディレクトリから PNPM コマンドを使用し、ワークスペーススクリプトを活用
- **型安全性:** OpenAPI 仕様書から TypeScript 型を自動生成。手動型定義は非推奨

## コード品質

- **フロントエンド:** リンティングに `make frontend-check`、自動修正に `make frontend-fix` を実行
- **TypeScript:** ワークスペース全体の型チェックに `make frontend-tsc` を実行

## E2Eテスト配置

- **管理画面機能:** `source/frontend/packages/e2e/tests/admin/[機能名].feature`
- **公開サイト機能:** `source/frontend/packages/e2e/tests/web/[機能名].feature`

## フロントエンド再設計方針

バックエンドのドメインロジック集約に伴い、フロントエンドを軽量化し、プレゼンテーション層に特化したアーキテクチャに再設計します。

### 現在のフロントエンド問題点

#### 1. 複雑な4層構造による問題

```
現在の構造:
source/frontend/packages/
├── entities/          # ドメインエンティティ（問題の根源）
├── service/           # ビジネスロジック
├── shared-interface-adapter/  # API通信・型定義
└── usecases/          # アプリケーションロジック（各アプリで個別実装）
```

**主要問題**:
- **責務の重複**: フロントエンドとバックエンドでドメインロジックが重複
- **データ変換の多重化**: 6回のデータ変換によるパフォーマンス劣化
- **保守コストの増大**: 同じビジネスルールを2箇所で管理
- **型安全性の複雑化**: エンティティ⇔DTO変換の型エラーリスク

#### 2. データフロー問題の詳細

```typescript
// 現在の問題のあるフロー
1. API Response (JSON) 
   ↓ スキーマ検証
2. BlogPostDTO 
   ↓ entityService.toDomain()
3. BlogPost Entity (ビジネスロジック実行)
   ↓ entityService.toDTO() 
4. BlogPostDTO
   ↓ API送信時
5. JSON
   ↓ 追加変換
6. さらなる中間型...
```

### フロントエンド軽量化戦略

#### 1. プレゼンテーション層特化アーキテクチャ

バックエンドのドメインロジック集約により、フロントエンドは以下に特化：

- **プレゼンテーション**: UI状態管理・レンダリング・ユーザーインタラクション
- **通信**: API呼び出し・エラーハンドリング・ローディング状態
- **バリデーション**: フォーム入力チェック（UIレベルのみ）
- **ルーティング**: ページ遷移・認証ガード
- **状態管理**: グローバル状態・キャッシュ管理

#### 2. ViewModelパターンの採用

ドメインエンティティを削除し、ViewModelパターンで軽量化：

```typescript
// 新しい軽量化されたViewModel
interface BlogPostViewModel {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
  
  // UI状態（プレゼンテーション層専用）
  isLoading?: boolean;
  isSelected?: boolean;
  displayMode?: 'card' | 'list' | 'detail';
}

// APIレスポンス → ViewModel直接変換
function toViewModel(apiResponse: BlogPostResponse): BlogPostViewModel {
  return {
    id: apiResponse.id,
    title: apiResponse.title,
    slug: apiResponse.slug,
    thumbnailUrl: apiResponse.thumbnail.url,
    summary: apiResponse.summary,
    publishedAt: formatDate(apiResponse.dates.post_date),
    updatedAt: formatDate(apiResponse.dates.last_update_date),
  };
}
```

#### 3. 新しいフロントエンドアーキテクチャ（Bulletproof React準拠）

```
軽量化後の構造:
source/frontend/packages/
└── shared-lib/            # 共用ライブラリパッケージ
    ├── api/              # API通信・キャッシュ管理
    ├── types/            # 生成された型定義・ViewModel定義  
    ├── utils/            # ユーティリティ関数
    └── components/       # 再利用可能UIコンポーネント
```

各アプリケーション（Bulletproof React準拠）:
```
├── web/
│   ├── lib/              # アプリ固有のライブラリディレクトリ
│   ├── components/       # アプリ固有のコンポーネント
│   ├── hooks/           # カスタムフック（API呼び出し + ViewModel変換）
│   └── pages/           # ページコンポーネント
└── blog-admin/
    ├── lib/             # 管理画面固有のライブラリディレクトリ
    ├── components/      # 管理画面固有のコンポーネント
    ├── hooks/          # 管理画面用カスタムフック
    └── pages/          # 管理画面ページ
```

### レイヤー再編成計画（完全削除戦略）

#### 1. entities, service, usecases, shared-interface-adapter パッケージの完全削除

**削除対象パッケージ**:
```
source/frontend/packages/
├── entities/              # → 完全削除（バックエンドに移行）
├── service/               # → 完全削除（ビジネスロジックはバックエンドへ）
├── shared-interface-adapter/  # → 完全削除（shared-libパッケージに統合）
└── [各アプリのusecases/]     # → 完全削除（カスタムフックに置換）
```

#### 2. shared-lib パッケージへの統合（Bulletproof React準拠）

```typescript
// shared-lib/api/base.ts - 汎用fetch処理
export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
};

// shared-lib/api/blog-posts.ts - 特化したAPI関数
export const blogPostApi = {
  getById: (id: string) => 
    apiClient.get<components['schemas']['BlogPost']>(`/api/v2/blog/posts/${id}`),
  
  getLatest: () =>
    apiClient.get<components['schemas']['BlogPostList']>('/api/v2/blog/posts/latest'),
    
  create: (data: components['schemas']['CreateBlogPostRequest']) =>
    apiClient.post<components['schemas']['BlogPost']>('/api/v2/admin/blog/posts', data),
};

// shared-lib/types/view-models.ts - ViewModel定義
export interface BlogPostViewModel {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
  isLoading?: boolean;
  isSelected?: boolean;
}

// shared-lib/utils/transformers.ts - 軽量な変換関数
export const transformers = {
  toBlogPostViewModel: (response: components['schemas']['BlogPost']): BlogPostViewModel => ({
    id: response.id,
    title: response.title,
    slug: response.slug,
    thumbnailUrl: response.thumbnail.url,
    summary: response.summary,
    publishedAt: formatDate(response.dates.post_date),
    updatedAt: formatDate(response.dates.last_update_date),
  }),
};
```

#### 3. アプリケーション層でのカスタムフック実装

```typescript
// web/hooks/use-blog-post.ts - 各アプリでの実装
export const useBlogPost = (id: string) => {
  const [viewModel, setViewModel] = useState<BlogPostViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    blogPostApi.getById(id)
      .then(response => setViewModel(transformers.toBlogPostViewModel(response)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);
  
  return { viewModel, loading, error };
};

// blog-admin/hooks/use-blog-post-form.ts - 管理画面専用
export const useBlogPostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createBlogPost = async (formData: BlogPostFormData) => {
    setIsSubmitting(true);
    try {
      const request = transformers.toCreateRequest(formData);
      const response = await blogPostApi.create(request);
      return transformers.toBlogPostViewModel(response);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { createBlogPost, isSubmitting };
};
```

### データフロー最適化

#### 新しいデータフロー

```
軽量化後のフロー（2回変換）:
1. API Response (生成された型)
   ↓ toViewModel()
2. ViewModel (表示用)
   ↓ コンポーネントレンダリング
3. UI表示
```

**改善点**:
- **変換回数**: 6回 → 2回（66%削減）
- **型安全性**: 生成された型によるコンパイル時保証
- **保守性**: 単一責任原則によるシンプルな構造
- **パフォーマンス**: 不要な中間オブジェクト生成の排除

### 実装アプローチ

#### shared-lib パッケージ基盤構築

1. **shared-lib パッケージ作成**
   - `source/frontend/packages/shared-lib/` パッケージを作成
   - Bulletproof React の構造に従った汎用ライブラリとして設計

2. **OpenAPI型生成の shared-lib への移行**
   - `make generate-types` の出力先を `shared-lib/types/generated.ts` に変更
   - ViewModel定義を `shared-lib/types/view-models.ts` に作成

3. **汎用API クライアント実装**
   - `shared-lib/api/base.ts` で汎用fetch処理を実装
   - エラーハンドリング・ローディング状態の統一

#### パッケージ完全削除とリファクタリング

1. **entities, service, usecases, shared-interface-adapter パッケージの完全削除**
   - ビジネスロジック → バックエンド移行
   - Repository パターン → shared-lib API関数に統合
   - UseCase クラス → カスタムフックに置換
   - 複雑な変換ロジック → 軽量なtransformer関数に簡素化

2. **アプリケーション層の再構築**
   - カスタムフック実装（API呼び出し + ViewModel変換）
   - コンポーネントのUseCase依存を削除
   - プロップスドリリングの最適化

3. **型安全性とパフォーマンスの最適化**
   - TypeScript コンパイルエラーの解消
   - 不要な依存関係の削除
   - バンドルサイズの最適化

### 期待される効果

#### 1. 開発効率の向上

- **型安全性**: OpenAPI生成型による強力な型チェック
- **学習コスト削減**: シンプルなアーキテクチャによる理解しやすさ
- **開発速度向上**: 中間変換処理の削除による実装の簡素化

#### 2. 保守性の向上

- **責務の明確化**: バックエンド（ビジネスロジック）とフロントエンド（プレゼンテーション）の分離
- **変更影響範囲の限定**: ドメインルール変更時はバックエンドのみ修正
- **テストの簡素化**: ビジネスロジックテストの統一

#### 3. パフォーマンス改善

- **メモリ使用量削減**: 不要な中間オブジェクトの削除
- **レンダリング最適化**: ViewModelによる効率的なReactレンダリング
- **バンドルサイズ削減**: entities/service/usecases/shared-interface-adapter パッケージの完全削除
- **依存関係の簡素化**: lib パッケージによる統一されたAPI

#### 4. アーキテクチャの簡素化

- **パッケージ数削減**: 8パッケージ → 5パッケージ（web/blog-admin/shared-lib/e2e/shared-test-data）
- **学習コスト削減**: Bulletproof React準拠による標準的な構造
- **責務の明確化**: プレゼンテーション（フロント）とビジネスロジック（バックエンド）の完全分離
- **保守性向上**: 単一パッケージ（shared-lib）による共通処理の統一管理

### 最終的なアーキテクチャ概要

```
完全削除後の構造:
source/frontend/packages/
├── shared-lib/            # 共用ライブラリパッケージ（Bulletproof React準拠）
│   ├── api/              # 統一されたAPI通信処理
│   ├── types/            # 生成型 + ViewModel定義
│   ├── utils/            # 軽量な変換関数・ユーティリティ
│   └── components/       # 再利用可能UIコンポーネント
├── web/                   # 公開サイト（API + ViewModel + UI）
│   └── lib/              # アプリ固有のライブラリディレクトリ
├── blog-admin/            # 管理画面（API + ViewModel + UI）
│   └── lib/              # 管理画面固有のライブラリディレクトリ
├── e2e/                   # E2Eテスト（維持）
└── shared-test-data/      # テストデータ（維持）
```

この再設計により、フロントエンドを軽量で保守しやすいプレゼンテーション特化アーキテクチャに転換し、Bulletproof React のベストプラクティスに準拠した現代的な構造を実現します。