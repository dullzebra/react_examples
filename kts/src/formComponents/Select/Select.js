import React from 'react';
import Select from 'react-select';
import {styles} from './SelectStyles';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';


class SelectRF extends React.Component {
  onSelectChange = (value) => {
    const {input: { onChange }, multiple } = this.props;
    let returnValue;

    if (multiple) {
      returnValue = value.map(value => value.value);
    } else {
      returnValue = value ? value.value : '';
    }

    onChange(returnValue);
  };

  render() {
    const {input, meta, placeholder, multiple, options, label, defaultValue, bsSize, disabled, loading = false} = this.props;
    const {name, value, onBlur, onChange, onFocus} = input;
    const transformedValue = transformValue(value, options, multiple);

    const isError = meta && meta.touched && meta.error;
    const validationState = isError ? 'error' : null;

    return (
      <FormGroup validationState={validationState}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <Select
          placeholder={placeholder}
          valueKey='value'
          name={name}
          value={transformedValue}
          defaultValue={defaultValue}
          options={options}
          onChange={this.onSelectChange}
          onBlur={() => onBlur(value)}
          onFocus={onFocus}
          styles={styles}
          isError={isError}
          isMulti={multiple}
          isDisabled={disabled}
          bsSize={bsSize}
          isLoading={loading}
        />
        {isError && <HelpBlock>{meta.error}</HelpBlock>}
      </FormGroup>
    );
  }
}

/**
 * For single select, Redux Form keeps the value as a string, while React Select
 * wants the value in the form { value: "grape", label: "Grape" }
 *
 * * For multi select, Redux Form keeps the value as array of strings, while React Select
 * wants the array of values in the form [{ value: "grape", label: "Grape" }]
 */
function transformValue(value, options, multi) {
  if (multi && typeof value === 'string') return [];

  const filteredOptions = options.filter(option => {
    return multi
      ? value.indexOf(option.value) !== -1
      : option.value === value;
  });

  return multi ? filteredOptions : filteredOptions[0];
}

export default SelectRF;
