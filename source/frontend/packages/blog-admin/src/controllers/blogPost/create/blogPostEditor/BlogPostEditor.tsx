import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
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
      <MarkdownShortcutPlugin />
    </CustomizedLexicalComposer>
  );
}

export default BlogPostEditor;
