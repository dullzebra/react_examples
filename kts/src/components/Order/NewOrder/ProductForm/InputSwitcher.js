import React from 'react';
import {Field} from 'redux-form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Text from '_formComponents/Text';

export default class InputSwitcher extends React.Component {
  state = {
    reduxFieldView: false,
  }

  toggle = reduxView => {
    if (reduxView) {
      this.setState({reduxFieldView: true}, () => {
        // ref to node <input />
        const inputRef = this.reduxField.getRenderedComponent?.().input;
        inputRef?.focus?.();
      });
    } else {
      this.setState({reduxFieldView: false});
    }
  }

  render() {
    const {reduxFieldView} = this.state;
    const {value, name, disabled} = this.props;

    if (reduxFieldView) {
      return (
        <Field
          name={name}
          component={Text}
          type='number'
          min={0}
          disabled={disabled}
          // BUG: in FF and Safari blur occures automatically after switch
          // onBlur={this.toggle.bind(this, false)}
          ref={ref => this.reduxField = ref}
          withRef={true}
        />
      );
    }
    return (
      <FormControl
        type='text'
        value={value}
        onFocus={this.toggle.bind(this, true)}
        onChange={() => null}
      />
    );
  }
}
