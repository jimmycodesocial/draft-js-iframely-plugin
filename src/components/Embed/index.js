import React from 'react';
import PropTypes from 'prop-types';

class Embed extends React.PureComponent {
  render () {
    const { blockProps, theme } = this.props;
    const { html } = blockProps;

    if (html) {
      return <div
        className={theme.embed}
        contentEditable={false} 
        dangerouslySetInnerHTML={{ __html: html }} />;
    }

    return  null;
  }
}

Embed.propTypes = {
  blockProps: PropTypes.object.isRequired
};

export default Embed;
