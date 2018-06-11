import React from 'react';
import PropTypes from 'prop-types';
import unionClassNames from 'union-class-names';
import { isCurrentBlockType } from '@jimmycode/draft-js-toolbox';

class EmbedButton extends React.PureComponent {
  onClick = (event) => {
    event.preventDefault();

    this.props.setEditorState(
      this.props.addEmbedder(this.props.getEditorState())
    );
  };

  onMouseDown = (event) => {
    event.preventDefault();
  }

  render() {
    const { theme, getEditorState, entityType } = this.props;
    const className = isCurrentBlockType(getEditorState(), entityType)
      ? unionClassNames(theme.button, theme.active)
      : theme.button;

    return (
      <div className={theme.buttonWrapper} onMouseDown={this.onMouseDown}>
        <button className={className} onClick={this.onClick} type="button">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 30 30"
            enableBackground="new 0 0 30 30"
            className="svgIcon"
            height="24"
            width="24">
            <polygon points="30,13.917 19,7 19,10 27,15 19,20 19,23 30,15.959" />
            <polygon points="0,13.917 11,7 11,10 3,15 11,20 11,23 0,15.958" />
          </svg>
        </button>
      </div>
    );
  }
}

EmbedButton.propTypes = {
  theme: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  addEmbedder: PropTypes.func.isRequired  
};

EmbedButton.defaultProps = {
  theme: {},
};

export default EmbedButton;
