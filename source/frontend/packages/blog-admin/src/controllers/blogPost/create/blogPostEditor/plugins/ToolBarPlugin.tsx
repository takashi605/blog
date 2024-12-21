import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import {
  useSelectedNode,
  useSelectedTextStyle,
  useUpdateBlockType,
} from './toolBarPluginHooks';

function ToolBarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const { $setHeadingToSelection } = useUpdateBlockType();
  const { $getElementTypeOfSelected } = useSelectedNode();
  const { isBoldSelected, $checkStylesForSelection, $toggleBoldToSelection } =
    useSelectedTextStyle();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(() => {
        const selectedNodeType = $getElementTypeOfSelected();
        setSelectedNodeType(selectedNodeType);
        $checkStylesForSelection();
      });
    });
  }, [editor, $getElementTypeOfSelected, $checkStylesForSelection]);

  const onClickH2Button = () => {
    editor.update(() => {
      $setHeadingToSelection('h2');
    });
  };

  const onClickH3Button = () => {
    editor.update(() => {
      $setHeadingToSelection('h3');
    });
  };

  const onClickBoldButton = () => {
    editor.update(() => {
      $toggleBoldToSelection();
    });
  };

  return (
    <div>
      <button
        role="button"
        onClick={onClickH2Button}
        disabled={selectedNodeType === 'h2'}
      >
        h2
      </button>
      <button
        role="button"
        onClick={onClickH3Button}
        disabled={selectedNodeType === 'h3'}
      >
        h3
      </button>
      <button role="button" onClick={onClickBoldButton}>
        bold
      </button>
      <p>選択中の要素：{selectedNodeType}</p>
      <p>選択中のテキスト：{isBoldSelected ? '太字' : '太字ではない'}</p>
    </div>
  );
}

export default ToolBarPlugin;
