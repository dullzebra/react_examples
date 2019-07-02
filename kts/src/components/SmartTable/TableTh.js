import React from 'react';
import styled from 'styled-components';
import TableHead from '_components/SmartTable/TableHead';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ColResizer from './ColResizer';

const Head = styled.th`
  cursor: pointer;
  vertical-align: top;
  white-space: nowrap;
  position: relative;
`;

const Arrow = styled(Glyphicon)`
  margin-left: 8px;
  font-size: .8em;
`;

class TableTh extends React.Component {
  thRef = React.createRef();

  state = {
    isMouseDown: false,
  };

  onResizerMouseDown = (e) => {
    const {
      name,
      setThElement,
    } = this.props;

    setThElement(e, this.thRef.current, name);
  };


  render() {
    const {
      handleSort,
      name,
      column,
      direction,
      head,
      style,
    } = this.props;
    const headName = typeof head[name] === 'object' ? head[name].name : head[name];
    const headSort = typeof head[name] === 'object' ? head[name].sort : name;

    return (
      <Head
        key={name}
        data-name={name}
        ref={this.thRef}
        style={style}
      >
        {headSort && handleSort && <div onClick={handleSort.bind(this, headSort)}>
          {headName}
          {column !== headSort && <Arrow glyph='glyphicon glyphicon-sort'/>}
          {column === headSort && direction === 'up' && <Arrow glyph='glyphicon glyphicon-arrow-up'/>}
          {column === headSort && direction === 'down' && <Arrow glyph='glyphicon glyphicon-arrow-down'/>}
        </div>}
        {(!headSort || !handleSort) && headName}
        <ColResizer
          onMouseDown={this.onResizerMouseDown}
        />
      </Head>
    );
  }
}

export default TableTh;
