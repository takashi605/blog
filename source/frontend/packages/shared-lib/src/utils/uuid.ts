import { v4 } from 'uuid';

export function createUUIDv4() {
  return v4();
}

// uuid v4 の形式を満たす正規表現を生成
// ・8文字-4文字-4文字-4文字-12文字 の形式であること
// ・16進数の文字列であること
// ・3番目のセクションの先頭文字は 4 であること
// ・4番目のセクションの先頭文字は 8, 9, a, b のいずれかであること
export function uuidv4Regex() {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex;
}
