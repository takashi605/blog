import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import {
  $getElementTypeOfSelected,
  $setH2ToSelection,
} from './toolBarPluginUtils';

function ToolBarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(() => {
        const selectedNodeType = $getElementTypeOfSelected();
        setSelectedNodeType(selectedNodeType);
      });
    });
  }, [editor]);

  const onClickH2 = () => {
    editor.update(() => {
      $setH2ToSelection();
    });
  };

  return (
    <div>
      <button role="button" onClick={onClickH2} disabled={selectedNodeType==='h2'}>
        h2
      </button>
      <p>選択中の要素：{selectedNodeType}</p>
    </div>
  );
}

export default ToolBarPlugin;
