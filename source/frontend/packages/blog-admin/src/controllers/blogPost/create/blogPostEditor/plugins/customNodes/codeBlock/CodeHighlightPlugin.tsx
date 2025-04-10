import { registerCodeHighlighting } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { useEffect } from 'react';
import { registerCodeLanguageSelecting } from './codeLanguageSelectionCommand';

const CodeHighlightPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      registerCodeHighlighting(editor),
      registerCodeLanguageSelecting(editor),
    );
  }, [editor]);

  return null;
};

export default CodeHighlightPlugin;
