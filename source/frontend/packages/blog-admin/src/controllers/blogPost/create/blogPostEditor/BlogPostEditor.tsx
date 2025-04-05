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
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import ToolBarPlugin from './plugins/ToolBarPlugin';
import { ImageRegister } from './customNodes/ImageNode/register/ImageRegister';

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
      <ToolBarPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <ImageRegister />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
