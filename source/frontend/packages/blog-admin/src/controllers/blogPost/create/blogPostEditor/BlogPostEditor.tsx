import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import CustomizedLexicalComposer from './CustomizedLexicalComposer';
import ToolBarPlugin from './plugins/ToolBarPlugin';

function BlogPostEditor() {
  return (
    <CustomizedLexicalComposer>
      <ToolBarPlugin />
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
