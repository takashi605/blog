import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState } from 'react';
import { $getElementTypeOfSelected } from './toolBarPluginUtils';

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
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      $setBlocksType(selection, () => $createHeadingNode('h2'));
    });
  };
  return (
    <div>
      <button role="button" onClick={onClickH2}>
        h2
      </button>
      <p>選択中の要素：{selectedNodeType}</p>
    </div>
  );
}

export default ToolBarPlugin;
