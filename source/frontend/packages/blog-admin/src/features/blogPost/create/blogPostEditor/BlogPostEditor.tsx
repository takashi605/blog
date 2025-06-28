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
import { BlogPostContentsSetterContext } from '../CreateBlogPostForm';
import { blogPostContentsToLexicalNodes } from '../helper/blogPostContentToLexicalNode';
import { lexicalNodeToBlogPostContent } from '../helper/lexicalNodeToBlogPostContent';
import { mockBlogPost } from '../helper/mockBlogPostData';
import styles from './blogPostEditor.module.scss';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import { validateUrl } from './helper/url';
import CodeHighlightPlugin from './plugins/customNodes/codeBlock/CodeHighlightPlugin';
import CodeLanguageClassPlugin from './plugins/customNodes/codeBlock/CodeLanguageClassPlugin';
import { ImageRegister } from './plugins/customNodes/image/ImagePlugin';
import ToolBarPlugin from './plugins/toolBar/ToolBarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';

function BlogPostEditor() {
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

  // モックデータからLexicalの初期エディタステートを作成
  const prepopulatedRichText = () => {
    const root = $getRoot();
    if (root.getChildrenSize() === 0) {
      // モックデータのcontentsをLexicalNodeに変換
      const nodes = blogPostContentsToLexicalNodes(mockBlogPost.contents);
      // ルートに直接追加（$insertNodesではなくroot.appendを使用）
      root.clear();
      root.append(...nodes);
    }
  };

  return (
    <CustomizedLexicalComposer initialEditorState={prepopulatedRichText}>
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
