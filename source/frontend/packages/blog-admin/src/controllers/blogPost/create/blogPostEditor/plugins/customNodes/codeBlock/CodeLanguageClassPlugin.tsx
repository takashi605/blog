import { CodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { TitledCodeNode } from './TitledCodeNode';

export default function CodeLanguageClassPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // CodeNode が作られた／更新されたタイミングで DOM に触る
    const codeNodeTransform = editor.registerNodeTransform(CodeNode, (node) => {
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

    // TitledCodeNode が作られた／更新されたタイミングで DOM に触る
    const titledCodeNodeTransform = editor.registerNodeTransform(TitledCodeNode, (node: TitledCodeNode) => {
      const codeElem = editor.getElementByKey(node.getKey());
      if (!codeElem) return;

      // 既存の language-* クラスを除去
      codeElem.classList.forEach((cls) => {
        if (cls.startsWith('language-')) codeElem.classList.remove(cls);
      });

      // 現在の言語を取得して付与（未設定なら plaintext）
      const lang = node.getLanguage() ?? 'plaintext';
      codeElem.classList.add(`language-${lang}`);

      // TODO 必要性を吟味。不要なら削除
      // // タイトルに基づいたデータ属性を設定
      // const title = node.getTitle();
      // if (title) {
      //   codeElem.setAttribute('data-title', title);
      //   codeElem.classList.add('has-title');
      // } else {
      //   codeElem.removeAttribute('data-title');
      //   codeElem.classList.remove('has-title');
      // }
    });

    return () => {
      codeNodeTransform();
      titledCodeNodeTransform();
    };
  }, [editor]);

  return null;
}
