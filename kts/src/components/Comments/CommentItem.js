import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from '_components/User/Avatar';
import CommentList from '_components/Comments/CommentList';
import CommentItemFooter from '_components/Comments/CommentItemFooter';

const Name = styled.div`
  font-weight: bold;
  font-size: .9em;
`;

const Del = styled.p`
  margin-top: 10px;
  font-size: .9em;
  font-style: italic;
`;


class CommentItem extends React.Component {
  render() {
    const {item, parent, userId, post, del, flag, allowChildren = true} = this.props;

    const itemProps = {
      authorId: item.user,
      commentId: item.id,
      flags: item.flags,
      date: item.submit_date,
      isRemoved: item.is_removed,
    };

    const formProps = {
      userId,
      post,
      del,
      flag,
    };

    return (
      <div className='media'>
        <div className='media-left'>
          {/* <img src='img_avatar1.png' className='media-object img-circle' style={{width:60}} /> */}
          <Avatar name={item.user_name} size={40} />
        </div>
        <div className='media-body'>
          <Name>{item.user_name}</Name>
          {item.is_removed && <Del>Сообщение было удалено</Del>}
          {!item.is_removed && <p>{item.comment}</p>}

          <CommentItemFooter
            {...formProps}
            {...itemProps}
            parent={parent}
            allowChildren={allowChildren}
          />

          <CommentList
            {...formProps}
            parent={item.id}
            allowChildren={false}
          />
        </div>
      </div>
    );
  }
}

export default CommentItem;

CommentItem.propTypes = {
  //formProps
  post: PropTypes.func,
  del: PropTypes.func,
  flag: PropTypes.func,
  userId: PropTypes.number,

  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_name: PropTypes.string,
    submit_date: PropTypes.string,
    comment: PropTypes.string,
  }),
};
