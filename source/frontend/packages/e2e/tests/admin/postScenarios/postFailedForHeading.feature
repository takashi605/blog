Feature: 記事投稿
  Scenario: 【異常系 記事投稿】101文字以上の見出しを含む記事を投稿する
    Given 【異常系 記事投稿】記事投稿ページにアクセスする
    Then 【異常系 記事投稿】リッチテキストエディタが表示されていることを確認する

    When 【異常系 記事投稿】タイトルに「テスト記事2」と入力する

    When 【異常系 記事投稿】サムネイル画像選択モーダルを開き、サムネイル画像を選択する

    When 【異常系 記事投稿】リッチテキストエディタに101文字以上入力し、その文字を選択して「h2」ボタンを押す
    Then 【異常系 記事投稿】リッチテキストエディタにレベル2見出しが表示されている

    When 【異常系 記事投稿】「投稿」ボタンを押す
    Then 【異常系 記事投稿】エラーメッセージが表示される

    When 【異常系 記事投稿】新着記事一覧ページにアクセスする
    Then 【異常系 記事投稿】投稿した記事が新着記事一覧ページに表示されていない
