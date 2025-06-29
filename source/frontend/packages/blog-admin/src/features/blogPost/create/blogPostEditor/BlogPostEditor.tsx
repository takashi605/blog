import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, type EditorState } from 'lexical';
import { useContext } from 'react';
import type { BlogPostContent } from 'shared-lib/src/api';
import { BlogPostContentsSetterContext } from '../CreateBlogPostForm';
import styles from './blogPostEditor.module.scss';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import { blogPostContentsToLexicalNodes } from './helper/blogPostContentToLexicalNode';
import { lexicalNodeToBlogPostContent } from './helper/lexicalNodeToBlogPostContent';
import { validateUrl } from './helper/url';
import CodeHighlightPlugin from './plugins/customNodes/codeBlock/CodeHighlightPlugin';
import CodeLanguageClassPlugin from './plugins/customNodes/codeBlock/CodeLanguageClassPlugin';
import { ImageRegister } from './plugins/customNodes/image/ImagePlugin';
import ToolBarPlugin from './plugins/toolBar/ToolBarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';

type BlogPostEditorProps = {
  initialContents?: BlogPostContent[];
};

function BlogPostEditor({ initialContents }: BlogPostEditorProps) {
  const setBlogPostContents = useContext(BlogPostContentsSetterContext);
  const onChange = (editor: EditorState) => {
    editor.read(() => {
      const root = $getRoot();
      const nodes = root.getChildren();
      // Lexicalエディタのコンテキスト内でLexicalNodeからBlogPostContentに変換
      const blogPostContents = lexicalNodeToBlogPostContent(nodes);
      setBlogPostContents(blogPostContents);
    });
  };

  // 初期コンテンツからLexicalの初期エディタステートを作成
  const prepopulatedRichText = () => {
    const root = $getRoot();
    if (root.getChildrenSize() === 0 && initialContents) {
      // 初期コンテンツをLexicalNodeに変換
      const nodes = blogPostContentsToLexicalNodes(initialContents);
      // ルートに直接追加（$insertNodesではなくroot.appendを使用）
      root.clear();
      root.append(...nodes);
    }
  };

  return (
    <CustomizedLexicalComposer
      initialEditorState={initialContents ? prepopulatedRichText : undefined}
    >
      <div className={styles.toolBarWrapper}>
        <ToolBarPlugin />
      </div>
      <RichTextPlugin
        contentEditable={<ContentEditable className={styles.contentEditable} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <ImageRegister />
      <CodeHighlightPlugin />
      <CodeLanguageClassPlugin />
      <TreeViewPlugin />
      <LexicalLinkPlugin validateUrl={validateUrl} />
      <ClickableLinkPlugin />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
