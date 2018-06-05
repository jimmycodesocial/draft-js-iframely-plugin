import React from 'react';
import PropTypes from 'prop-types';

class Embed extends React.PureComponent {
  componentWillMount() {
    // Or if you prefer, in your index.html:
    // <script src="//cdn.iframe.ly/embed.js" async></script>
    if (!window.iframely) {
      const script = document.createElement('script');

      script.async = 1;
      script.src = '//cdn.iframe.ly/embed.js';
      script.onload = () => {
        iframely.load();
      };

      document.body.appendChild(script);
    }
  }

  render () {
    const {
      theme,
      block, // eslint-disable-line no-unused-vars
      blockProps, // eslint-disable-line no-unused-vars
      customStyleMap, // eslint-disable-line no-unused-vars
      customStyleFn, // eslint-disable-line no-unused-vars
      decorator, // eslint-disable-line no-unused-vars
      forceSelection, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      selection, // eslint-disable-line no-unused-vars
      tree, // eslint-disable-line no-unused-vars
      contentState, // eslint-disable-line no-unused-vars
      blockStyleFn, // eslint-disable-line no-unused-vars
      style,
      className,
      ...elementProps
    } = this.props;

    const { html } = blockProps;
    const classname = `${theme.embed || ''} ${className}`;

    if (html) {
      return <div
        {...elementProps}
        className={classname}
        contentEditable={false} 
        dangerouslySetInnerHTML={{ __html: html }} 
        style={{ display: 'inline-bock', ...style }} />;
    }

    return  null;
  }
}

Embed.propTypes = {
  blockProps: PropTypes.object.isRequired
};

Embed.defaultProps = {
  theme: {}
};

export default Embed;
