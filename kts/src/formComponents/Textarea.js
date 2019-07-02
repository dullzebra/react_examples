import React from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

class Textarea extends React.Component {
  render() {
    const { input, meta, placeholder, label, showErrors = true } = this.props;
    const isError = meta && meta.touched && meta.error;
    const validationState = showErrors && isError ? 'error' : null;

    return (
      <FormGroup validationState={validationState}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl
          {...input}
          rows={4}
          componentClass='textarea'
          placeholder={placeholder}
        />
        {showErrors && isError && <HelpBlock>{meta.error}</HelpBlock>}
      </FormGroup>
    );
  }
}

export default Textarea;
