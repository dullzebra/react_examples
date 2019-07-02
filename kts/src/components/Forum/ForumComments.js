import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import CommentList from '_components/Comments/CommentList';
import CommentForm from '_components/Comments/CommentForm';
import {hrBorder} from '!!sass-variable-loader!_styles/scss/bootstrap/_variables.scss';

import {selectCurrentUserId} from '_selectors';
import {
  resetForumComments,
  getForumComments,
  postForumComment,
  deleteForumComment,
  postForumCommentFlag,
} from '_actions';

const actions = {
  resetForumComments,
  getForumComments,
  postForumComment,
  deleteForumComment,
  postForumCommentFlag,
};

const Header = styled.h4`
  margin-bottom: 24px;
`;

class ForumComments extends React.Component {
  componentDidMount() {
    const {id, resetForumComments, getForumComments} = this.props;
    resetForumComments();
    getForumComments({content_object: id});
  }

  handlePost = (formData) => {
    const {postForumComment, id} = this.props;
    return postForumComment({content_object: id, ...formData});
  }

  handleDelete = (commentId, dispatchParams) => {
    const {deleteForumComment} = this.props;
    return deleteForumComment(commentId, dispatchParams);
  }

  handleFlag = (commentId, flag) => {
    const {postForumCommentFlag} = this.props;
    return postForumCommentFlag(commentId, {flag});
  }

  render() {
    const {commentsAmount, userId} = this.props;

    return (
      <div>
        {commentsAmount > 0 && <Header>Ответы &nbsp;<span className='badge'>{commentsAmount}</span></Header>}
        <CommentList
          parent={null}
          userId={userId}
          post={this.handlePost}
          del={this.handleDelete}
          flag={this.handleFlag}
        />
        <h5>Ответить</h5>
        <CommentForm post={this.handlePost} parent={null} form='CommentsForm_root' />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commentsAmount: state.forum.commentsAmount,
    userId: selectCurrentUserId(state),
  };
};

export default connect(mapStateToProps, actions)(ForumComments);

ForumComments.propTypes = {
  id: PropTypes.number.isRequired,
};
