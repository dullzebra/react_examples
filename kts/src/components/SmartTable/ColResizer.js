import styled from "styled-components";
import React from "react";

const ColResizerContainer = styled.div`
    position: absolute;
    user-select: none;
    top: 0;
    right: -8px;
    width: 16px;
    height: 100%;
    cursor: col-resize;
    z-index: 100;
    overflow: hidden;
    
    th:last-child & {
      right: 0;
      width: 8px;
    }
`;
const ColResizerLeft = styled.div`
    position: absolute;
    background-color: rgb(221, 221, 221);
    height: 50%;
    width: 1px;
    top: 25%;
    left: 6px;
`;
const ColResizerRight = styled.div`
    position: absolute;
    background-color: rgb(221, 221, 221);
    height: 50%;
    width: 1px;
    top: 25%;
    left: 8px;
    th:last-child & {
      display: none;
    }
`;

class ColResizer extends React.Component {

  render() {
    const {
      onMouseDown,
    } = this.props;

    return (
      <ColResizerContainer
        onMouseDown={onMouseDown}
      >
        <ColResizerLeft/>
        <ColResizerRight/>
      </ColResizerContainer>
    );
  }
}

export default ColResizer;