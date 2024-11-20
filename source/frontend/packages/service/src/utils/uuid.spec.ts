import { createUUIDv4, uuidv4Regex } from './uuid';

describe('uuid', () => {
  it('uuid v4 の形式に即したランダム文字列が生成される', async () => {
    const uuid1 = createUUIDv4();
    const uuid2 = createUUIDv4();
    expect(uuidv4Regex().test(uuid1)).toBe(true);
    expect(uuidv4Regex().test(uuid2)).toBe(true);
    expect(uuid1).not.toBe(uuid2);
  });
});
