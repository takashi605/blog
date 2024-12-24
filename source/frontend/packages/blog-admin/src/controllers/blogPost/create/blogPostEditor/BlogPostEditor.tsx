import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, type EditorState } from 'lexical';
import { useContext } from 'react';
import { ContentsDTOSetterContext } from '../CreateBlogPostForm';
import { typedContentToDTO } from '../helper/typedContentToDTO';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import ToolBarPlugin from './plugins/ToolBarPlugin';

function BlogPostEditor() {
  const setContentsDTO = useContext(ContentsDTOSetterContext);
  const onChange = (editor: EditorState) => {
    editor.read(() => {
      const root = $getRoot();
      const nodes = root.getChildren();
      setContentsDTO(typedContentToDTO(nodes));
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
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
