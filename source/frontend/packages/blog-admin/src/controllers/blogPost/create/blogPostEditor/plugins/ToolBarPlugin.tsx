import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $getTypeOfSelectedNode } from './toolBarPluginUtils';

function ToolBarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(
    'paragraph',
  );

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setSelectedNodeType($getTypeOfSelectedNode());
    });
  }, [editor]);
  return (
    <div>
      <button role="button">h2</button>
      <p>選択中の要素：{selectedNodeType}</p>
    </div>
  );
}

export default ToolBarPlugin;
