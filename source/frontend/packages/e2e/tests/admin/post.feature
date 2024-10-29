Feature: 記事投稿

  Scenario: 記事を投稿する
    Given 記事投稿ページにアクセスする
    When 記事タイトルのインプットに「タイトル」を入力する
    When 「h2」ボタンを押す
    Then h2のインプットが表示される
    When h2に「見出しレベル2」と入力する
    When 「paragraph」ボタンを押す
    Then paragraphのインプットが表示される
    When paragraphのインプットに「paragraph入力値」と入力する
    When 「h3」ボタンを押す
    Then h3 のインプットが表示される
    When h3 のインプットに「見出しレベル3」と入力する
    When 公開ボタンを押す
    Then 「記事を公開しました」と表示される
