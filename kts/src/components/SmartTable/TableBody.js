import React from 'react';
import PropTypes from 'prop-types';
import TableRow from './TableRow';

class TableBody extends React.Component {
  state = {
    selected: null,
    checked: [],
  }

  handleSelectRow = (id) => {
    this.props.onSelectRow(id);
    this.setState({selected: id});
  }

  handleCheckRow = (id) => {
    const {checked} = this.state;
    const newchecked = [...checked];
    const idIndex = checked.indexOf(id);

    // trigger id in array
    if (idIndex > -1) {
      newchecked.splice(idIndex, 1);
    } else {
      newchecked.push(id);
    }
    this.props.onCheckRows(newchecked);
    this.setState({checked: newchecked});
  }

  render() {
    const {selected, checked} = this.state;
    const {
      data,
      onSelectRow,
      onCheckRows,
      cellStyles,
    } = this.props;
    const selectable = !!onSelectRow;
    const checkable = !!onCheckRows;
    return (
      <tbody>
      {data.map(item =>
        <TableRow
          key={item.id}
          data={item}
          cellStyles={cellStyles}
          selectable={selectable}
          selected={selected === item.id}
          onClick={this.handleSelectRow}
          checkable={checkable}
          checked={checked.includes(item.id)}
          onCheck={this.handleCheckRow}
        />)}
      </tbody>
    );
  }
}

TableBody.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  onSelectRow: PropTypes.func,
  onCheckRows: PropTypes.func,
};

export default TableBody;
