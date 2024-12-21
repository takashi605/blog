import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';

function BlogPostEditor() {
  return (
    <CustomizedLexicalComposer>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
