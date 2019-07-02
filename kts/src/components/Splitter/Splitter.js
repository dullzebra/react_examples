import React from 'react';
import SplitPane from 'react-split-pane';
import './Splitter.scss';
import styled from 'styled-components';

const SplitterWrapper = styled.div`
  position:relative;
  height: ${props => props.height}px;
`;

class Splitter extends React.Component {
  state ={
    splitContainerHeight: 0,
  }

  splitContainerRef = React.createRef();

  getRestHeight = () => {
    const top = this.splitContainerRef.current.getBoundingClientRect().top;
    this.setState({splitContainerHeight : window.innerHeight - top - 50});
  };

  componentDidMount() {
    this.getRestHeight();
  }

  render() {
    const {children, splitPanProps} = this.props;
    return (
      <SplitterWrapper height={this.state.splitContainerHeight} ref={this.splitContainerRef}>
        <SplitPane {...splitPanProps}>
          {children}
        </SplitPane>
      </SplitterWrapper>
    );
  }
}

export default Splitter;
