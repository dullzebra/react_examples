import React from 'react';
import qs from 'qs';
import Button from 'react-bootstrap/lib/Button';
import styled from 'styled-components';

const Panel = styled.div`
  //text-align: center;
`;

class LoadMore extends React.Component {
  onClick = () => {
    const {next, loadMore} = this.props;
    const params = qs.parse(next);

    loadMore(params);
  };

  render() {
    const {next, bsSize, bsStyle} = this.props;

    if (!next) {
      return null;
    }

    return (
      <Panel>
        <Button bsStyle={bsStyle || 'primary'} bsSize={bsSize} onClick={this.onClick}>
          Показать ещё
        </Button>
      </Panel>
    );
  }
}

export default LoadMore;
