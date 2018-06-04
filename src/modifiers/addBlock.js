import { EditorState, AtomicBlockUtils } from 'draft-js'

export const getCurrentBlock = (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());

  return block;
};

export const addBlock = (editorState, entityType, data = {}) => {
  const selectionState = editorState.getSelection();

  if (!selectionState.isCollapsed()) {
    return editorState;
  }

  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);

  if (!currentBlock || currentBlock.getLength() !== 0 || currentBlock.getType() === entityType) {
    return editorState;
  }

  const newBlock = currentBlock.merge({
    type: entityType,
    data: data,
  });

  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState,
  });

  return EditorState.push(editorState, newContentState, 'change-block-type');
};

export const addAtomicBlock = (editorState, entityType, data = {}) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityType, 'IMMUTABLE', data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
}
