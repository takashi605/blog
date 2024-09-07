Feature: 計算機

  Scenario: 足し算
    Given "http://web:80" にアクセスする
    When 「5・6」ボタンを押すと input それぞれに「5」「6」が表示される
    When 計算ボタンを押す
    Then "11" が表示される
