import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import CommentList from '_components/Comments/CommentList';
import CommentForm from '_components/Comments/CommentForm';
import {hrBorder} from '!!sass-variable-loader!_styles/scss/bootstrap/_variables.scss';

import {selectCurrentUserId} from '_selectors';
import {
  resetNewsComments,
  getNewsComments,
  postNewsComment,
  deleteNewsComment,
  postNewsCommentFlag,
} from '_actions';

const actions = {
  resetNewsComments,
  getNewsComments,
  postNewsComment,
  deleteNewsComment,
  postNewsCommentFlag,
};

const Hr = styled.div`
    margin: 2em 0;
    border-top: 2px solid ${hrBorder};
`;

const Header = styled.h4`
  margin-bottom: 16px;
`;

class NewsComments extends React.Component {
  componentDidMount() {
    const {id, resetNewsComments, getNewsComments} = this.props;
    resetNewsComments();
    getNewsComments({content_object: id});
  }

  handlePost = (formData) => {
    const {postNewsComment, id} = this.props;
    return postNewsComment({content_object: id, ...formData});
  }

  handleDelete = (commentId, dispatchParams) => {
    const {deleteNewsComment} = this.props;
    return deleteNewsComment(commentId, dispatchParams);
  }

  handleFlag = (commentId, flag) => {
    const {postNewsCommentFlag} = this.props;
    return postNewsCommentFlag(commentId, {flag});
  }

  render() {
    const {commentsAmount, userId} = this.props;

    return (
      <div>
        <Hr />
        <Header>Комментарии &nbsp;<span className='badge'>{commentsAmount}</span></Header>
        <CommentList
          parent={null}
          userId={userId}
          post={this.handlePost}
          del={this.handleDelete}
          flag={this.handleFlag}
        />
        <Hr />
        <h5>Оставить комментарий</h5>
        <CommentForm post={this.handlePost} parent={null} form='CommentsForm_root' />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commentsAmount: state.news.commentsAmount,
    userId: selectCurrentUserId(state),
  };
};

export default connect(mapStateToProps, actions)(NewsComments);

NewsComments.propTypes = {
  id: PropTypes.number.isRequired,
};
