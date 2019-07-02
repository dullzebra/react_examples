import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TableTh from './TableTh';

const CheckHead = styled.th`
  width: 10px;
  text-align: center;
`;

const MIN_CELL_WIDTH = 45;

class TableHead extends React.Component {
  state = {
    column: null,
    direction: null,
    thName: null,
    thOffset: {},
    thWidth: {},
    thOriginalWidth: {},
    thOldWidth: {},
    resizerX: {},
    colWidth: {},
  };

  componentDidMount() {
    this.setColStyles();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.sortBy && !this.props.sortBy) {
      this.setState({
        column: null,
        direction: null,
      });
    }
  }

  setColStyles = () => {
    if (this.headTrRef) {
      const colWidth = {};
      const ths = this.headTrRef.querySelectorAll('th');

      Array.prototype.forEach.call(ths, th => {
        colWidth[th.dataset.name] = th.offsetWidth;
        th.style.width = '';
        th.style.minWidth = '';
      });

      this.setState({
        colWidth,
      });
    }
  };

  onMouseUp = (e) => {
    this.setState({
      thName: null,
    });
  };

  onMouseMove = (e) => {
    const {
      setTableWidth,
    } = this.props;

    const {
      thName,
      resizerX,
      thWidth,
      thOriginalWidth,
    } = this.state;

    if (thName) {
      const width = thOriginalWidth[thName] + e.pageX - resizerX[thName];

      if (width >= MIN_CELL_WIDTH) {
        const newThWidth = {
          ...thWidth,
          [thName]: thOriginalWidth[thName] + e.pageX - resizerX[thName],
        };
        setTableWidth(e.pageX - resizerX[thName]);
        this.setState({
          thWidth: newThWidth,
        });
      }
    }
  };

  // on mouseDown
  setThElement = (e, th, name) => {
    const {
      setOriginalTableWidth,
    } = this.props;
    const {
      thOriginalWidth,
      resizerX,
    } = this.state;

    setOriginalTableWidth();

    const nextThOriginalWidth = {
      ...thOriginalWidth,
      [name]: th.offsetWidth,
    };
    const nextResizerX = {
      ...resizerX,
      [name]: e.pageX,
    };

    this.setState({
      thName: name,
      thOriginalWidth: nextThOriginalWidth,
      resizerX: nextResizerX,
    });
  };

  renderColGroup = () => {
    const {
      head,
      checkable,
    } = this.props;
    const {
      thWidth,
      colWidth,
    } = this.state;
    const nodes = [];

    if (checkable) {
      nodes.push(<col key={0}/>);
    }

    for (const key in head) {
      if (head.hasOwnProperty(key) && key !== 'id') {
        let style = {};

        if (colWidth.hasOwnProperty(key)) {
          style = {
            ...style,
            width: colWidth[key],
          };
        }

        if (thWidth[key]) {
          style = {
            ...style,
            width: thWidth[key],
          };
        }

        nodes.push(
          <col
            dataname={key}
            style={style}
            key={key}/>
        );
      }
    }
    return nodes;
  };

  renderHead = () => {
    const {
      column,
      direction,
    } = this.state;
    const {
      head,
      sortable,
      checkable,
      cellStyles,
    } = this.props;
    const nodes = [];

    if (checkable) {
      nodes.push(<CheckHead key={0}/>);
    }

    let sortableProps = {};

    if (sortable) {
      sortableProps = {
        handleSort: this.handleSort,
        column,
        direction,
      };
    }
    for (const key in head) {
      if (head.hasOwnProperty(key) && key !== 'id') {
        let style = cellStyles && cellStyles.hasOwnProperty(key) ? cellStyles[key] : {};
        style = {
          ...style,
          position: 'sticky',
          top: '0',
          zIndex: 1,
        };

        nodes.push(
          <TableTh
            setDefaultColWidth={this.setDefaultColWidth}
            setThElement={this.setThElement}
            key={key}
            name={key}
            text={typeof head[key] === 'object' ? head[key].name : head[key]}
            head={head}
            style={style}
            {...sortableProps}
          />
        );
      }
    }
    return nodes;
  };

  handleSort = clickedColumn => {
    const {column, direction} = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        direction: 'up',
      });
      this.props.onSortColumn(clickedColumn);
      return;
    }

    this.props.onSortColumn(null);
    this.setState({
      direction: direction === 'up' ? 'down' : 'up',
    });
  };

  render() {
    return (
      <React.Fragment>
        <colgroup>
          {this.renderColGroup()}
        </colgroup>
        <thead>
          <tr ref={(headTr) => {
            this.headTrRef = headTr;
          }}>
            {this.renderHead()}
          </tr>
        </thead>
      </React.Fragment>
    );
  }
}

TableHead.propTypes = {
  head: PropTypes.object.isRequired,
  sortable: PropTypes.bool.isRequired,
  onSortColumn: PropTypes.func.isRequired,
  checkable: PropTypes.bool.isRequired,
};


export default TableHead;
