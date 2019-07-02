import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {stateInfoBg} from '!!sass-variable-loader!_styles/scss/bootstrap/_variables.scss';
import {formatNumber, formatDate} from '_utils';
import isDate from 'lodash/isDate';


const Row = styled.tr`
  cursor: pointer;
  background-color: ${props => (props.selected && stateInfoBg)};  
  &:hover{
    background-color: ${props => (props.selected && stateInfoBg)} !important;  
  }
`;

const Td = styled.td`
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Table sorting causes cells rerender. Memo fixes that
const RenderCells = React.memo(props => {
  const {
    row,
    cellStyles,
  } = props;
  const nodes = [];

  for (const key in row) {
    if (row.hasOwnProperty(key) && key !== 'id') {
      let val;
      let needFormat;
      let style = cellStyles && cellStyles.hasOwnProperty(key) ? cellStyles[key] : {};

      if (style.hasOwnProperty('width')) {
        style = {
          ...style,
          width: '',
        };
      }

      if (style.hasOwnProperty('minWidth')) {
        style = {
          ...style,
          minWidth: '',
        };
      }

      if (typeof row[key] === 'object' && row[key].hasOwnProperty('value')) {
        val = row[key].value;
        needFormat = row[key].needFormat;
      } else {
        val = row[key];
        needFormat = true;
      }

      if (typeof val === 'boolean' && needFormat) {
        val = val ? 'Да' : 'Нет';
      } else if (row[key].formattedValue) {
        val = row[key].formattedValue;
      } else if (isDate(val) && needFormat) {
        val = formatDate(val);
      } else if (!isNaN(val) && needFormat) {
        val = formatNumber(val);
      }

      nodes.push(
        <Td
          title={typeof val !== 'object' ? val : ''}
          style={style}
          key={key}>
          {val}
        </Td>
      );
    }
  }
  return nodes;
});

class TableRow extends React.Component {
  onRowClick = (id) => {
    const {selectable, checkable, onClick, onCheck} = this.props;
    selectable && onClick(id);
    checkable && onCheck(id);
  };

  render() {
    const {
      data,
      selectable,
      selected,
      checkable,
      checked,
      onCheck,
      cellStyles,
    } = this.props;

    if (!selectable && !checkable) {
      return (
        <tr key={data.id}>
          <RenderCells
            cellStyles={cellStyles}
            row={data}
          />
        </tr>
      );
    }

    return (
      <Row
        onClick={this.onRowClick.bind(this, data.id)}
        selected={selected || checked}>
        {checkable && <td key={0}>
          <input type='checkbox' checked={checked} onChange={onCheck.bind(this, data.id)}/>
        </td>}
        <RenderCells
          cellStyles={cellStyles}
          row={data}
        />
      </Row>
    );
  }
}

TableRow.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onClick: PropTypes.func,

  checkable: PropTypes.bool,
  checked: PropTypes.bool,
  onCheck: PropTypes.func,
};

export default TableRow;


