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
import { lexicalNodeToBlogPostContent } from '../helper/lexicalNodeToBlogPostContent';
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

  return (
    <CustomizedLexicalComposer>
      <RichTextPlugin
        contentEditable={<ContentEditable className={styles.contentEditable} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ToolBarPlugin />
      <MarkdownShortcutPlugin />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <ImageRegister />
      <CodeHighlightPlugin />
      <CodeLanguageClassPlugin />
      <TreeViewPlugin />
      <LexicalLinkPlugin validateUrl={validateUrl} />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
