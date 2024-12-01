import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('トップページにアクセスしてピックアップ記事を閲覧する', () => {});
Then('ピックアップ記事が3件表示されている', () => {});
Then('各ピックアップ記事のサムネイル画像が表示されている', () => {});
Then('各ピックアップ記事の記事タイトルが表示されている', () => {});
