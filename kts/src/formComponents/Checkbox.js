import React from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

class RFCheckbox extends React.Component {
  render() {
    const { input, meta, label } = this.props;
    const isError = meta && meta.touched && meta.error;
    const validationState = isError ? 'error' : null;

    return (
      <FormGroup validationState={validationState}>
        <Checkbox
          {...input}
          checked={input.value}
        >
          {label}
        </Checkbox>
        {isError && <HelpBlock>{meta.error}</HelpBlock>}
      </FormGroup>
    );
  }
}

export default RFCheckbox;
