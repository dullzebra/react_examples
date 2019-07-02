import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import Table from 'react-bootstrap/lib/Table';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TableColumnFilter from './TableColumnFilter';

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  transform: translateY(-36px);
  margin-bottom: -36px;
`;


const prepareData = (head, data = []) => {
  const preparedData = data.map(item => {
    const preparedItem = {};
    for (const key in head) {
      preparedItem[key] = typeof item[key] === 'number' ? item[key] : item[key] || '-';
    }
    return preparedItem;
  });

  return preparedData;
};

const checkNumberByKey = (key) => {
  return (o) => {
    let val;

    if (typeof o[key] === 'object' && o[key].hasOwnProperty('value')) {
      val = o[key].value;

      if (typeof val === 'function') {
        val = val();
      }
    } else {
      val = o[key];
    }
    const number = parseInt(val, 10);

    return isNaN(number) ? val : number;
  };
};

class SmartTable extends React.Component {
  tableWrapRef = React.createRef();

  state = {
    data: prepareData(this.props.head, this.props.source),
    id: this.props.id,
    key: null,
    tableWidth: null,
    originalTableWidth: null,
    tableHead: this.props.head,
  };

  componentDidMount() {
    this.setOriginalTableWidth();
  }

  setOriginalTableWidth = () => {
    if (this.tableWrapRef.current) {
      const width = this.tableWrapRef.current.querySelector('table').offsetWidth;
      this.setState({
        originalTableWidth: width,
        tableWidth: width,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      originalTableWidth,
      tableWidth,
      tableHead,
    } = this.state;

    if (!tableWidth && !originalTableWidth) {
      this.setOriginalTableWidth();
    }

    if (!isEqual(tableHead, prevState.tableHead)) {
      this.setState({data: prepareData(tableHead, this.props.source)});
    }
  }

  handleSort = clickedColumn => {
    const {data} = this.state;
    const sorted = sortBy(data, checkNumberByKey([clickedColumn]));

    if (clickedColumn) {
      this.setState({
        data: sorted,
      });
    } else {
      this.setState({
        data: [...data.reverse()],
      });
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data.length !== nextProps.source.length
      || nextProps.id !== prevState.id
    // || (nextProps.source && !isEqual(prevState.data, nextProps.source))
    ) {
      return {
        data: prepareData(prevState.tableHead, nextProps.source),
        id: nextProps.id,
        key: Math.random(),
      };
    }

    return null;
  }

  setTableWidth = (width) => {
    const {
      originalTableWidth,
    } = this.state;

    this.setState({
      tableWidth: originalTableWidth + width,
    });
  };

  setTableHead = filterHead => {
    this.setState({tableHead: filterHead});
  }

  render() {
    // console.log('render table');
    const {
      data,
      key,
      tableWidth,
      tableHead,
    } = this.state;
    const {
      head,
      sortable,
      onSelectRow,
      onCheckRows,
      cellStyles,
      sortingFn,
      sortBy,
      filterColumn,
    } = this.props;

    if (!data.length) return (<div>Нет данных для таблицы</div>);

    let tableStyle = {};

    if (tableWidth) {
      tableStyle = {
        ...tableStyle,
        minWidth: tableWidth,
        tableLayout: 'fixed',
        marginBottom: 0,
        position: 'relative',
      };
    }

    return (<>
      {filterColumn && head &&
         <FilterContainer>
           <TableColumnFilter
             head={head}
             onChange={this.setTableHead}
             lsItem={filterColumn}
           />
         </FilterContainer>}
      <div
        ref={this.tableWrapRef}
        style={{
          overflowY: 'auto',
          height: '100%',
        }}
      >
        <Table
          hover
          responsive
          style={tableStyle}
        >

          {!isEmpty(tableHead) &&
          <TableHead
            cellStyles={cellStyles}
            head={tableHead}
            sortable={sortable}
            onSortColumn={sortingFn || this.handleSort}
            checkable={!!onCheckRows}
            setTableWidth={this.setTableWidth}
            setOriginalTableWidth={this.setOriginalTableWidth}
            sortBy={sortBy}
          />}
          <TableBody
            cellStyles={cellStyles}
            key={key}
            data={data}
            onSelectRow={onSelectRow}
            onCheckRows={onCheckRows}

          />
        </Table>
      </div>
    </>);
  }
}


SmartTable.propTypes = {
  source: PropTypes.arrayOf(PropTypes.object),

  /* head = {
    key1: {name:'Поле с параметром для сортровки', sort: 'contract__number'},
    key2: 'Просто текстовое поле без параметра сортировки, сортировка зависит от sortable props'
    ...}
  }*/
  head: PropTypes.object,

  id: PropTypes.number,
  sortable: PropTypes.bool,
  sortingFn: PropTypes.func,

  // can be used together
  onSelectRow: PropTypes.func,
  onCheckRows: PropTypes.func,

  // string = name of localStorage item
  filterColumn: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

SmartTable.defaultProps = {
  sortable: false,
  filterColumn: false,
};


export default SmartTable;
