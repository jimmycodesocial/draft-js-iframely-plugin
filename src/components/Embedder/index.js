import React from 'react';
import PropTypes from 'prop-types';

class Embedder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { text: '' }; 
  }

  componentDidMount() {
    this.input.focus();
  }

  cancel = () => {
    this.props.blockProps.onCancel(this.props.block);
    this.props.blockProps.setReadOnly(false);
  }

  onChange = (event) => this.setState({ text: event.target.value });
  
  onFocus = (event) => this.props.blockProps.setReadOnly(true);

  onKeyDown = (event) => {
    // Cancel on Escape or Del.
    if ((event.keyCode === 27) || (event.keyCode === 46 && this.state.text.length === 0)) {
      this.cancel();
    }
  }

  onKeyPress = async (event) => {
    if (event.key === 'Enter') {
      await this.props.blockProps.onRequest(this.props.block, this.state.text);
      this.props.blockProps.setReadOnly(false);
    }
  }

  render() {
    const { blockProps, theme } = this.props;
    const { placeholder } = blockProps;
        
    return (
      <div
        className={theme.embedderContainer}
        onBlur={this.cancel}
        onFocus={this.onFocus}>

        <input 
          ref={ref => this.input = ref}
          className={theme.embedderInput}
          placeholder={placeholder}
          value={this.state.text}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown} 
          onKeyPress={this.onKeyPress}/>
      </div>
    );
  }
}

Embedder.propTypes = {
  block: PropTypes.object,
  blockProps: PropTypes.shape({
    placeholder: PropTypes.string.isRequired,
    setReadOnly: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRequest: PropTypes.func.isRequired
  })
};

export default Embedder;
