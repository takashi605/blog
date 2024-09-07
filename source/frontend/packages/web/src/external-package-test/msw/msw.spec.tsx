import fetch from 'cross-fetch';
import { server } from './server';

beforeAll(() => {
  server.listen();
});
afterEach(async () => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

describe('msw の学習テスト', () => {
  describe('mock した api からのレスポンスが正しく受け取れる', () => {
    describe('https://example.com/user', () => {
      it('GET', async () => {
        const resp = await fetch('https://example.com/user');
        const user: User = await resp.json();
        expect(user.id).toBe('c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d');
        expect(user.firstName).toBe('John');
        expect(user.lastName).toBe('Maverick');
      });
    });
  });
});
