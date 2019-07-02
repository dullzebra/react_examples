import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import OrderCommentsList from '_components/Order/OrderComments/OrderCommentsList';
import OrderCommentsForm from '_components/Order/OrderComments/OrderCommentsForm';
import Loader from '_components/Loader/Loader';

import {selectOrderCommentsFlatList} from '_selectors';

import {
  getOrderComments,
  postOrderComment,
  resetOrderComments,
  getNewOrderComments,
} from '_actions/orders';

const actions = {
  getOrderComments,
  postOrderComment,
  resetOrderComments,
  getNewOrderComments,
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Messages = styled.div`
  flex-grow: 1;  
  position: relative;  
`;

class OrderComments extends React.Component {
  timer = null;

  state = {
    loading: false,
  }

  componentDidMount() {
    const {id, getOrderComments, resetOrderComments, getNewOrderComments} = this.props;
    resetOrderComments();

    this.setState({loading: true});
    getOrderComments({content_object: id})
      .then(() => {
        this.setState({loading: false});
        this.timer = setInterval(getNewOrderComments.bind(this, {content_object: id}), 10000);
      });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handlePost = (formData) => {
    const {postOrderComment, id} = this.props;
    return postOrderComment({content_object: id, ...formData});
  }

  render() {
    const {commentsList, manager} = this.props;
    const {loading} = this.state;

    return (
      <Container>
        <Messages>
          {loading &&
          <div className='centered'>
            <Loader />
          </div>}
          {!loading &&
          <OrderCommentsList
            list={commentsList}
            manager={manager}
          />}
        </Messages>
        <OrderCommentsForm post={this.handlePost} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    commentsList: selectOrderCommentsFlatList(state),
  };
};

export default connect(mapStateToProps, actions)(OrderComments);

OrderComments.propTypes = {
  id: PropTypes.number,
  manager: PropTypes.number,
};
