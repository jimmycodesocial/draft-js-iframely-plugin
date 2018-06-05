import decorateComponentWithProps from 'decorate-component-with-props';
import { EmbedButton, Embedder, Embed } from './components';
import { addBlock, addAtomicBlock, removeBlock } from './modifiers';
import { fetchUrlMetadata } from './utils';
import { EditorState } from 'draft-js';
import defaultTheme from './plugin.css';

const ATOMIC = 'atomic';
const defaultOptions = {
  placehoder: 'Paste a link to embed content and press Enter',
  handleOnReturn: true,
  handleOnPaste: false,

  // Your API key.
  apiKey: null,

  // Params to pass in the request.
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
  options = {},
  embedderType = 'draft-js-iframely-plugin-embedder',
  embedType = 'draft-js-iframely-plugin-embed',
  decorator = (component) => component
} = {}) => {

  // Modifiers.
  const addEmbedder = (editorState, data = {}) => addBlock(editorState, embedderType, data);
  const addEmbed = (editorState, data) => addAtomicBlock(editorState, embedType, data);

  // Plugin.
  const pluginOptions = Object.assign({}, defaultOptions, options);
  const pluginTheme = Object.assign({}, defaultTheme, theme);

  const ThemedEmbedder = decorateComponentWithProps(Embedder, { theme: pluginTheme });
  const DecoratedEmbed = decorator(Embed);
  const ThemedEmbed = decorateComponentWithProps(DecoratedEmbed, { theme: pluginTheme });

  return {
    blockRendererFn: (block, { getEditorState, setEditorState, setReadOnly }) => {
      // Add Embed?
      if (block.getType() == ATOMIC) {
        const contentState = getEditorState().getCurrentContent();
        const entityKey = block.getEntityAt(0);

        if (!entityKey) {
          return null;
        }

        const entity = contentState.getEntity(entityKey);

        if (entity.getType() === embedType) {
          return {
            component: ThemedEmbed,
            editable: false,
            props: entity.getData()
          };
        }
      }

      // Embedding?
      else if (block.getType() === embedderType) {
        return {
          component: ThemedEmbedder,
          editable: false,
          props: {
            placeholder: pluginOptions.placehoder,
            setReadOnly,

            onCancel: (block) => {
              setEditorState(removeBlock(getEditorState(), block.key));
            },

            onRequest: async (block, text) => {
              const data = await fetchUrlMetadata(text, pluginOptions);
              let editorState = removeBlock(getEditorState(), block.key);

              if (data) {
                editorState = addEmbed(editorState, data);
              }

              setEditorState(editorState);
            }
          }
        };
      }

      return null;
    },

    handlePastedText: async (text, html, editorState, { setEditorState }) => {
      if (!pluginOptions.handleOnPaste) {
        return 'not-handled';
      }

      const data = await fetchUrlMetadata(text.trim(), pluginOptions);

      if (data) {
        setEditorState(addEmbed(editorState, data));
        return 'handled';
      }

      return 'not-handled';
    },

    handleReturn: async (event, editorState, { setEditorState }) => {
      if (!pluginOptions.handleOnReturn) {
        return 'not-handled';
      }

      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const contentBlock = contentState.getBlockForKey(startKey);
      const data = await fetchUrlMetadata(contentBlock.getText().trim(), pluginOptions);

      if (data) {
        setEditorState(addEmbed(editorState, data));
        return 'handled';
      }

      return 'not-handled';
    },

    EmbedButton: decorateComponentWithProps(EmbedButton, {
      entityType: embedderType,
      addEmbedder,
    }),

    addEmbedder,
    addEmbed
  };
};
