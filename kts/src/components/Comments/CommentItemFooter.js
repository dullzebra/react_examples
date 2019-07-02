import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import CommentForm from '_components/Comments/CommentForm';
import ErrorMessage from '_components/Alert/ErrorMessage';

import {brandPrimary, gray} from '!!sass-variable-loader!_styles/scss/bootstrap/_variables.scss';

moment.locale('ru');

const Date = styled.div`
  color: ${gray}; 
  margin-right: 8px;
`;

const Sign = styled(Glyphicon)`
  margin-right: 3px;
  color: ${brandPrimary};
  font-size: 1.3em; 
  vertical-align: top;
`;

const Button = styled.span`
  display: inline-block;
  padding: 2px 8px;
  color: ${brandPrimary};
  cursor:pointer;
`;

const Panel = styled.div`
  display: flex;  
  align-items: center;
  font-size: 0.8em;
`;

const Wrapper = styled.div` 
  margin-bottom: 1em;  
`;

const Actions = styled.div`
  flex-grow:1;  
`;

class CommentItemFooter extends React.PureComponent {
  state = {
    formOpen: false,
    error: null,
    like: this.props.flags && this.props.flags.like,
    // dislike:  this.props.flags && this.props.flags.dislike,
    removal:  this.props.flags && this.props.flags.removal,
  }

  toggleForm = () => {
    const {formOpen} = this.state;
    this.setState({ formOpen: !formOpen });
  }

  toggleFlag = (flag) => {
    const {active, count} = this.state[flag];
    const newState = {
      active: !active,
      count: active ? count - 1 : count + 1,
    };
    this.setState( {[flag] : newState} );
  }

  flagAction = (flagName, postData) => {
    const {flag, commentId} = this.props;
    this.setState( {error: null});

    return flag(commentId, postData)
      .then(() => {
        this.toggleFlag(flagName);
      })
      .catch(() => {
        this.setState( {error: 'Не удалось выполнить операцию'} );
      });
  }

  like = () => {
    this.flagAction('like', 'I liked it');
  }

  /*   dislike = () => {
    this.flagAction('dislike', 'I disliked it');
  } */

  complain = () => {
    this.flagAction('removal', 'removal suggestion');
  }

  remove = () => {
    const {del, commentId, parent} = this.props;
    this.setState( {error: null});

    return del(commentId, {id: commentId, parent})
      .catch(() => {
        this.setState( {error: 'Не удалось удалить сообщение'} );
      });
  }

  render() {
    const {
      commentId,
      userId,
      authorId,
      date,
      isRemoved,
      post,
      allowChildren = true,
      parent,
    } = this.props;

    const {
      formOpen,
      error,
      like,
      dislike,
      removal,
    } = this.state;

    if (isRemoved) {
      return null;
    }

    const authorActions = (
      <Button onClick={this.remove}>Удалить</Button>
    );

    const userActions = (
      <>
        <Button onClick={this.toggleForm}>Ответить</Button>

        {removal && <Button onClick={this.complain}>
          {removal.active && <Sign
            glyph='glyphicon glyphicon-exclamation-sign'
            title='Вы пожаловались на сообщение' />}
          Пожаловаться</Button>}

        {like && <Button onClick={this.like} title='Нравится'>
          {!like.active && <Sign glyph='glyphicon glyphicon-heart-empty' />}
          {like.active && <Sign glyph='glyphicon glyphicon-heart' />}
          {like.count > 0 && <>({like.count})</>}
        </Button>}

      {/*   {dislike && <Button onClick={this.dislike} title='Не нравится'>
          <Sign active={`${dislike.active}`} glyph='glyphicon glyphicon-thumbs-down' />
              ({dislike.count})
        </Button>} */}
      </>
    );

    return (
      <Wrapper>
        <Panel>
          <Date>{moment(date).fromNow()}</Date>
          <Actions>
            {userId === authorId && authorActions}
            {userId !== authorId && userActions}
          </Actions>
        </Panel>
        <ErrorMessage width={400}>{error}</ErrorMessage>

        {formOpen &&
        <CommentForm
          parent={allowChildren ? commentId : parent}
          post={post}
          form={`CommentsForm_${commentId}`}
          onSubmit={this.toggleForm}
          onCancel={this.toggleForm}
        />}
      </Wrapper>
    );
  }
}


export default CommentItemFooter;

CommentItemFooter.propTypes = {
  post: PropTypes.func,
  del: PropTypes.func,
  flag: PropTypes.func,

  parent: PropTypes.number,
  userId: PropTypes.number,
  authorId: PropTypes.number,
  commentId: PropTypes.number,
  date: PropTypes.string,
  isRemoved: PropTypes.bool,

  flags: PropTypes.shape({
    like: PropTypes.shape({active: PropTypes.bool, count: PropTypes.number}),
    dislike: PropTypes.shape({active: PropTypes.bool, count: PropTypes.number}),
    removal: PropTypes.shape({active: PropTypes.bool, count: PropTypes.number}),
  }),
};
