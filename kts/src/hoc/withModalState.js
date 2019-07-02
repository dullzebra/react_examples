import React from 'react';

export default (Component) => {
  class withModalState extends React.Component {
    state = {
      show: false,
    }

    openModal = () => this.setState({show: true})

    closeModal = () => this.setState({show: false})

    render() {
      const { show } = this.state;

      return <Component
        show={show}
        open={this.openModal}
        close={this.closeModal}
        {...this.props} />;
    }
  }
  return withModalState;
};
