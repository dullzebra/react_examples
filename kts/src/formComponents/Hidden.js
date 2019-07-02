import React from 'react';
import styled from 'styled-components';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from '_components/Tooltip/Tooltip';

const Value = styled(FormControl.Static)`
  padding-right: 25px;
`;

const Sign = styled(Glyphicon)`
  pointer-events: all;
  font-size: 1.5rem;
`;

class Hidden extends React.Component {
  render() {
    const {input: {name}, meta, val} = this.props;
    const isError = meta && meta.error;
    const isWarning = meta && meta.warning;
    const validationState = isError ? 'error' : (isWarning ? 'warning' : null);

    return (
      <FormGroup validationState={validationState}>
        <Value>{val}</Value>
        <Tooltip tooltip={isError || isWarning} placement='right'>
          <FormControl.Feedback>
            {validationState && <Sign glyph='exclamation-sign' />}
          </FormControl.Feedback>
        </Tooltip>
        <input type='hidden'
          name={name}
          value={val}
        />
      </FormGroup>
    );
  }
}

export default Hidden;
