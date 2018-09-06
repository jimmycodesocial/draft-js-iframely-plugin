import decorateComponentWithProps from 'decorate-component-with-props';
import { isBlockWithEntityType, getCurrentBlock, addBlock, addAtomicBlock, removeBlock } from '@jimmycode/draft-js-toolbox';
import { EmbedButton, Embedder, Embed } from './components';
import { fetchUrlMetadata } from './utils';
import { EditorState } from 'draft-js';
import defaultTheme from './plugin.css';

const defaultOptions = {
  placeholder: 'Paste a link to embed content and press Enter',
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
  decorator = (component) => component,
  embedComponent = Embed,
  editable = false
} = {}) => {

  // Modifiers.
  const addEmbedder = (editorState, data = {}) => addBlock(editorState, embedderType, data);
  const addEmbed = (editorState, data) => addAtomicBlock(editorState, embedType, data);

  // Plugin.
  const pluginOptions = Object.assign({}, defaultOptions, options);
  const pluginTheme = Object.assign({}, defaultTheme, theme);

  const ThemedEmbedder = decorateComponentWithProps(Embedder, { theme: pluginTheme });
  const DecoratedEmbed = decorator(embedComponent);
  const ThemedEmbed = decorateComponentWithProps(DecoratedEmbed, { theme: pluginTheme });

  return {
    blockRendererFn: (block, { getEditorState, setEditorState, setReadOnly }) => {
      // Add Embed?
      if (isBlockWithEntityType(getEditorState(), block, embedType)) {
        return {
          component: ThemedEmbed,
          editable
        };
      }

      // Embedding?
      else if (block.getType() === embedderType) {
        return {
          component: ThemedEmbedder,
          editable: false,
          props: {
            placeholder: pluginOptions.placeholder,
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

      const contentBlock = getCurrentBlock(editorState);
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
