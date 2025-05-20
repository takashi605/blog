import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
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

export const urlRegex =
  /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  export const validateUrl = (text: string) => {
    return urlRegex.test(text);
  };

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
      <LexicalLinkPlugin validateUrl={validateUrl} />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
