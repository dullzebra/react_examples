import React from 'react';
import styled from 'styled-components';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import {
  inputColorPlaceholder,
} from '!!sass-variable-loader!_sassVars';

const Sign = styled(Glyphicon)`
  display: block;
  color:  ${inputColorPlaceholder} !important;
`;

const SignButton = styled(Button)`
  padding: ${props => props.bsSize === 'sm' ? '8px' : '9px' };
`;

const Wrapper = ({children, hasAddon, bsSize, onClick}) => {
  if (hasAddon) {
    return (
      <InputGroup>
        {children}
        <InputGroup.Button>
          <SignButton bsSize={bsSize} title='Очистить' onClick={onClick}><Sign glyph='remove'/></SignButton>
        </InputGroup.Button>
      </InputGroup>
    );
  }

  return <>{children}</>;
};

class Text extends React.Component {
  clear = () => {
    const {input: {onChange}} = this.props;
    onChange(null);
  }

  render() {
    const {input, meta, placeholder, label, bsSize = null, needClear = false, refName, ...rest} = this.props;
    const isError = meta && meta.touched && meta.error;
    const validationState = isError ? 'error' : null;

    return (
      <FormGroup validationState={validationState}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <Wrapper hasAddon={needClear} bsSize={bsSize} onClick={this.clear}>
          <FormControl
            {...input}
            {...rest}
            {...(bsSize ? {bsSize} : {})}
            componentClass='input'
            placeholder={placeholder}
            inputRef={ref => {
              this.input = ref;
            }}
          />
        </Wrapper>
        {isError && <HelpBlock>{meta.error}</HelpBlock>}
      </FormGroup>
    );
  }
}

export default Text;
