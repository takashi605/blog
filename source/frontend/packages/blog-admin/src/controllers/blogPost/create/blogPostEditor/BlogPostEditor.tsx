import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, type EditorState } from 'lexical';
import { useContext } from 'react';
import { ContentsDTOSetterContext } from '../CreateBlogPostForm';
import { postContentAsFormDataToDTO } from '../helper/postContentAsFormDataToDTO';
import styles from './blogPostEditor.module.scss';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import CodeHighlightPlugin from './plugins/customNodes/codeBlock/CodeHighlightPlugin';
import CodeLanguageClassPlugin from './plugins/customNodes/codeBlock/CodeLanguageClassPlugin';
import { ImageRegister } from './plugins/customNodes/image/ImagePlugin';
import ToolBarPlugin from './plugins/toolBar/ToolBarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';

function BlogPostEditor() {
  const setContentsDTO = useContext(ContentsDTOSetterContext);
  const onChange = (editor: EditorState) => {
    editor.read(() => {
      const root = $getRoot();
      const nodes = root.getChildren();
      setContentsDTO(postContentAsFormDataToDTO(nodes));
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
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
