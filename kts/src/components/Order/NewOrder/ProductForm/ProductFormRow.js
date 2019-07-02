import React from 'react';
import {Field} from 'redux-form';
import styled from 'styled-components';

import FormControl from 'react-bootstrap/lib/FormControl';
import Hidden from '_formComponents/Hidden';
import InputSwitcher from './InputSwitcher';

const TD = styled.td`
  .form-group{
    margin-bottom: 0;
  }
`;

export default React.memo(({
  rowClass,
  rowName,
  show,
  disabled,
  ...rest
}) => {
  const cells = [];
  for (const key in rest) {
    if (key === 'quantity') {
      cells.push(<TD key={key}>
        <InputSwitcher
          value={rest[key]}
          name={`${rowName}.quantity`}
          disabled={disabled}
        />
      </TD>);
    } else if (key === 'in_stock') {
      cells.push(<TD key={key}>
        {rest[key] != null && <Field name={`${rowName}.in_stock`} component={Hidden} val={rest[key]} />}
        {rest[key] == null && <FormControl.Static>не известно</FormControl.Static>}
      </TD>);
    } else if (typeof rest[key] === 'boolean') {
      cells.push(<TD key={key}><FormControl.Static>{rest[key] ? 'Да' : 'Нет'}</FormControl.Static></TD>);
    } else {
      cells.push(<TD key={key}><FormControl.Static>{rest[key]}</FormControl.Static></TD>);
    }
  }

  return (
    <tr className={rowClass} style={{display: show ? 'table-row' : 'none'}}>
      {cells}
    </tr>
  );
});

