# Claude Command: Commit

このコマンドは、コンベンショナルコミットメッセージと絵文字を使用した、整形式のコミットを作成するのに役立ちます。

## 使用方法

コミットを作成するには、以下を入力するだけです：

```
/commit
```

またはオプション付きで：

```
/commit --no-verify
```

## このコマンドの機能

1. **プリコミットチェック** - **重要 このフェーズは必ず実行する**`--no-verify` オプションが指定されていない限り、以下のチェックを実行する：
   - api 仕様( @source/backend/api_test )を変更した場合、　`make generate-types` を実行して api 型を更新
   - バックエンドコード( @source/backend )を変更した場合、`make api-fix` -> `make api-test-run-include-ignored` を実行してコード品質を確保
   - フロントエンドコード( @source/frontend )を変更した場合、`make frontend-fix` → `make frontend-test` を実行してコード品質を確保
2. `git status`でステージングされたファイルをチェック
3. ステージングされたファイルが 0 の場合、`git add`で変更されたファイルと新しいファイルをすべて自動的に追加
4. `git diff`を実行して、コミットされる変更内容を理解
5. diff を分析して、複数の異なる論理的な変更が存在するかを判断
6. 複数の異なる変更が検出された場合、コミットを複数の小さなコミットに分割することを提案
7. 各コミット（または分割しない場合は単一のコミット）に対して、絵文字付きコンベンショナルコミット形式でコミットメッセージを作成
8. `git branch --contains`を実行して現在のブランチのスクラム番号を理解。コミットメッセージにスクラム番号を含める(例： ✨ feat: ブログ記事一覧画面からブログ記事編集画面へのリンクを追加 SCRUM-567)
## コミットのベストプラクティス
- **コミット前の検証**：コードがリントされ、正しくビルドされ、ドキュメントが更新されていることを確認
- **原子的なコミット**：各コミットは単一の目的を果たす関連する変更を含むべき
- **大きな変更の分割**：変更が複数の関心事に及ぶ場合は、別々のコミットに分割
- **コンベンショナルコミット形式**：`<type>: <description>`の形式を使用。type は以下のいずれか：
  - feat: 新機能
  - fix: バグ修正
  - docs: ドキュメントの変更
  - style: コードスタイルの変更（フォーマットなど）
  - refactor: バグ修正も機能追加もないコード変更
  - perf: パフォーマンスの改善
  - test: テストの追加または修正
  - chore: ビルドプロセス、ツールなどの変更
- **現在形、命令法**：コミットメッセージは命令として書く（例：「add feature」で「added feature」ではない）
- **簡潔な最初の行**：最初の行は 72 文字以内に収める
- **絵文字**：各コミットタイプは適切な絵文字とペアになっています：
  - ✨ feat: 新機能
  - 🐛 fix: バグ修正
  - 📝 docs: ドキュメント
  - 💄 style: フォーマット/スタイル
  - ♻️ refactor: コードリファクタリング
  - ⚡️ perf: パフォーマンス改善
  - ✅ test: テスト
  - 🔧 chore: ツール、設定
  - 🚀 ci: CI/CD の改善
  - 🗑️ revert: 変更の取り消し
  - 🧪 test: 失敗するテストの追加
  - 🚨 fix: コンパイラ/リンター警告の修正
  - 🔒️ fix: セキュリティ問題の修正
  - 👥 chore: コントリビューターの追加または更新
  - 🚚 refactor: リソースの移動または名前変更
  - 🏗️ refactor: アーキテクチャの変更
  - 🔀 chore: ブランチのマージ
  - 📦️ chore: コンパイル済みファイルまたはパッケージの追加または更新
  - ➕ chore: 依存関係の追加
  - ➖ chore: 依存関係の削除
  - 🌱 chore: シードファイルの追加または更新
  - 🧑‍💻 chore: 開発者体験の改善
  - 🧵 feat: マルチスレッドまたは並行処理に関連するコードの追加または更新
  - 🔍️ feat: SEO の改善
  - 🏷️ feat: 型の追加または更新
  - 💬 feat: テキストとリテラルの追加または更新
  - 🌐 feat: 国際化とローカライゼーション
  - 👔 feat: ビジネスロジックの追加または更新
  - 📱 feat: レスポンシブデザインの作業
  - 🚸 feat: ユーザーエクスペリエンス/使いやすさの改善
  - 🩹 fix: 重要でない問題の簡単な修正
  - 🥅 fix: エラーのキャッチ
  - 👽️ fix: 外部 API の変更によるコードの更新
  - 🔥 fix: コードまたはファイルの削除
  - 🎨 style: コードの構造/フォーマットの改善
  - 🚑️ fix: 重要なホットフィックス
  - 🎉 chore: プロジェクトの開始
  - 🔖 chore: リリース/バージョンタグ
  - 🚧 wip: 作業中
  - 💚 fix: CI ビルドの修正
  - 📌 chore: 依存関係を特定のバージョンに固定
  - 👷 ci: CI ビルドシステムの追加または更新
  - 📈 feat: 分析またはトラッキングコードの追加または更新
  - ✏️ fix: タイポの修正
  - ⏪️ revert: 変更の取り消し
  - 📄 chore: ライセンスの追加または更新
  - 💥 feat: 破壊的変更の導入
  - 🍱 assets: アセットの追加または更新
  - ♿️ feat: アクセシビリティの改善
  - 💡 docs: ソースコード内のコメントの追加または更新
  - 🗃️ db: データベース関連の変更の実行
  - 🔊 feat: ログの追加または更新
  - 🔇 fix: ログの削除
  - 🤡 test: モックの作成
  - 🥚 feat: イースターエッグの追加または更新
  - 🙈 chore: .gitignore ファイルの追加または更新
  - 📸 test: スナップショットの追加または更新
  - ⚗️ experiment: 実験の実行
  - 🚩 feat: 機能フラグの追加、更新、または削除
  - 💫 ui: アニメーションとトランジションの追加または更新
  - ⚰️ refactor: デッドコードの削除
  - 🦺 feat: バリデーションに関連するコードの追加または更新
  - ✈️ feat: オフラインサポートの改善

## コミット分割のガイドライン

diff を分析する際、以下の基準に基づいてコミットの分割を検討してください：

1. **異なる関心事**：コードベースの無関係な部分への変更
2. **異なる種類の変更**：機能、修正、リファクタリングなどの混在
3. **ファイルパターン**：異なる種類のファイルへの変更（例：ソースコード対ドキュメント）
4. **論理的なグループ化**：個別に理解またはレビューしやすい変更
5. **サイズ**：分割した方が明確になる非常に大きな変更

## 例

良いコミットメッセージ：

- ✨ feat: ユーザー認証システムを追加
- 🐛 fix: レンダリング処理のメモリリークを修正
- 📝 docs: 新しいエンドポイントの API ドキュメントを更新
- ♻️ refactor: パーサーのエラーハンドリングを簡素化
- 🚨 fix: コンポーネントのリンター警告を解消
- 🧑‍💻 chore: 開発ツールセットアップ手順を改善
- 👔 feat: 取引バリデーションのビジネスロジックを実装
- 🩹 fix: ヘッダーの軽微なスタイル不整合を修正
- 🚑️ fix: 認証フローの重大なセキュリティ脆弱性を修正
- 🎨 style: コンポーネント構造を整理し可読性向上
- 🔥 fix: 旧式コードを削除
- 🦺 feat: ユーザー登録フォームに入力バリデーションを追加
- 💚 fix: CI パイプラインの失敗を修正
- 📈 feat: ユーザーエンゲージメント用の分析トラッキングを実装
- 🔒️ fix: パスワード要件を強化
- ♿️ feat: スクリーンリーダー対応を改善

コミット分割の例：
1. ✨ feat: 新しい solc バージョン用型定義を追加
2. 📝 docs: 新しい solc バージョンのドキュメント更新
3. 🔧 chore: package.json の依存関係を更新
4. 🏷️ feat: 新 API エンドポイントの型定義を追加
5. 🧵 feat: ワーカースレッドの並列処理を改善
6. 🚨 fix: 新コードのリンターエラーを修正
7. ✅ test: 新機能用ユニットテストを追加
8. 🔒️ fix: 脆弱性のある依存パッケージを更新

## コマンドオプション

- --no-verify: プリコミットチェック（lint、build、generate:docs）をスキップ

## 重要な注意事項

- デフォルトでは、コード品質を確保するために**プリコミットチェック**が実行されます
- これらのチェックが失敗した場合、それでもコミットを続行するか、まず問題を修正するかを尋ねられます
- 特定のファイルが既にステージングされている場合、コマンドはそれらのファイルのみをコミットします
- ファイルがステージングされていない場合、変更されたファイルと新しいファイルをすべて自動的にステージングします
- コミットメッセージは、検出された変更に基づいて構築されます
- コミット前に、コマンドは diff を確認して、複数のコミットがより適切かどうかを識別します
- 複数のコミットを提案する場合、変更を個別にステージングしてコミットするのを支援します
- 常にコミットの diff を確認して、メッセージが変更と一致していることを確認します
- コミットメッセージには常に、現在のスクラム番号を含めます
