import { CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ParagraphNode, TextNode } from 'lexical';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-css-extras';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';
import styles from 'shared-ui/src/blogPost/styles/blogPostViewer.module.scss';
import { CustomCodeNode } from './plugins/customNodes/codeBlock/CustomCodeNode';
import { ImageNode } from './plugins/customNodes/image/ImageNode';

const theme = {
  code: `language-js ${styles.codeBlock}`,
  heading: {
    h2: styles.h2,
    h3: styles.h3,
  },
  paragraph: styles.paragraph,
  link: styles.linkText,
  text: {
    code: styles.inlineCodeText,
  },
  // 全てのコードブロック関連クラスについて、prism のクラスを適用する
  codeHighlight: {
    atrule: 'token atrule',
    attr: 'token attr',
    boolean: 'token boolean',
    builtin: 'token builtin',
    cdata: 'token cdata',
    char: 'token char',
    class: 'token class',
    'class-name': 'token class-name',
    comment: 'token comment',
    constant: 'token constant',
    deleted: 'token deleted',
    doctype: 'token doctype',
    entity: 'token entity',
    function: 'token function',
    important: 'token important',
    inserted: 'token inserted',
    keyword: 'token keyword',
    namespace: 'token namespace',
    number: 'token number',
    operator: 'token operator',
    prolog: 'token prolog',
    property: 'token property',
    punctuation: 'token punctuation',
    regex: 'token regex',
    selector: 'token selector',
    string: 'token string',
    symbol: 'token symbol',
    tag: 'token tag',
    url: 'token url',
    variable: 'token variable',
  },
};

type CustomizedLexicalComposerProps = {
  children: React.ReactNode;
};

function CustomizedLexicalComposer({
  children,
}: CustomizedLexicalComposerProps) {
  const initialConfig = {
    namespace: 'MyEditor',
    // TODO 適切なエラーハンドリングを実装する
    onError: (error: Error) => {
      console.error(error);
    },
    // node を色々と追加しないと MarkDown が動かないらしい： https://zenn.dev/ikenohi/scraps/e2832cbcb566a2
    nodes: [
      LinkNode,
      AutoLinkNode,
      ListNode,
      ListItemNode,
      HorizontalRuleNode,
      CodeHighlightNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      ParagraphNode,
      TextNode,
      ImageNode,
      CustomCodeNode,
    ],
    theme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>{children}</LexicalComposer>
  );
}

export default CustomizedLexicalComposer;
