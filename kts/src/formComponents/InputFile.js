import React from 'react';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { brandSuccess } from '!!sass-variable-loader!_sassVars';

const Sign = styled(Glyphicon)`
  margin-right: 8px;    
`;

const SignFile = styled(Glyphicon)` 
  font-size: 2em;
  color: ${brandSuccess};
`;

const SignRemove = styled(Glyphicon)`
  margin-left: 8px; 
  margin-bottom: 3px;
  font-size: 1.1em;
  cursor: pointer;  
`;

const Hidden = styled.span`
  display: none;
`;

const FileName = styled.div`
  display: flex;
  align-items: flex-end; 
  white-space: nowrap;
`;

class InputFile extends React.Component {
  onChange = e => {
    const {input} = this.props;
    input.onChange(e.target.files[0]);
  }

  removeFile = () => {
    const {input} = this.props;
    input.onChange(null);
  }

  render() {
    const {input, label, meta} = this.props;
    const isError = meta && meta.touched && meta.error;
    const validationState = isError ? 'error' : null;

    return (
      <FormGroup validationState={validationState}>
        {!input.value &&
        <Button
          className='form-control'
          onClick={() => this.input.click()}>
          <Sign glyph='glyphicon glyphicon-paperclip' />
          {!label && <>Обзор&hellip;</>}
          {label}
        </Button>}

        {input.value &&
        <FileName>
          <SignFile glyph='glyphicon glyphicon-file' />
          {input.value.name}
          <SignRemove glyph='glyphicon glyphicon-remove' title='Удалить файл' onClick={this.removeFile} />
        </FileName>}

        {isError && <HelpBlock>{meta.error}</HelpBlock>}

        <Hidden>
          <input type='file'
            onChange={this.onChange}
            ref={el => {
              this.input = el;
            }} />
        </Hidden>
      </FormGroup>
    );
  }
}

export default InputFile;
