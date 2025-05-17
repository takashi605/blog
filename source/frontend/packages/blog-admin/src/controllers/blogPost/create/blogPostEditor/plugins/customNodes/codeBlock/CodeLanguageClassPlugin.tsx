import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { CustomCodeNode } from './CustomCodeNode';

export default function CodeLanguageClassPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // CustomCodeNode が作られた／更新されたタイミングで DOM に触る
    const customCodeNodeTransform = editor.registerNodeTransform(CustomCodeNode, (node: CustomCodeNode) => {
      const codeElem = editor.getElementByKey(node.getKey());
      if (!codeElem) return;

      // 既存の language-* クラスを除去
      codeElem.classList.forEach((cls) => {
        if (cls.startsWith('language-')) codeElem.classList.remove(cls);
      });

      // 現在の言語を取得して付与（未設定なら plaintext）
      const lang = node.getLanguage() ?? 'plaintext';
      codeElem.classList.add(`language-${lang}`);
    });

    return () => {
      customCodeNodeTransform();
    };
  }, [editor]);

  return null;
}
