Feature: 計算機

  Scenario: 足し算
    Given "http://localhost:80" にアクセスする
    When "1" と "2" を入力する
    When 計算ボタンを押す
    Then "3" が表示される
