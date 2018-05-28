import decorateComponentWithProps from 'decorate-component-with-props';
import isUrl from 'is-url';
import addEmbed from './modifiers/addEmbed';
import { ATOMIC } from './constants';

const defultOptions = {
  placehoder: 'Paste a link to embed content and press Enter',
  handleOnReturn: true,

  // Your API key.
  apiKey: null,

  // Param to pass in the request.
  // see: https://iframely.com/docs/parameters
  params: {
    iframe: 1,
    rel: 'summary',
    omit_script: true,
    align: 'center',
    html5: 1
  },

  onRequest: async (url) => {
    return (await fetch(url)).json();
  }
};

export default ({
  theme = {},
  options = defultOptions,
  entityType = 'draft-js-iframely-plugin-embed'
} = {}) => {

  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === ATOMIC) {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);

        if (entity && contentState.getEntity(entity).getType() === entityType) {
          return {
            component: <div/>,
            editable: false,
            props: entity.getData()
          };
        }
      }

      return null;
    },

    handleReturn: async (event, editorState, { setEditorState }) => {
    },

    addEmbed: (editorState, data) => {
      return addEmbed(editorState, data, entityType);
    }
  };
};
