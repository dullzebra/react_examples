import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CommentItem from '_components/Comments/CommentItem';

class CommentList extends React.Component {
  render() {
    const {list, parent, userId, post, del, flag, allowChildren = true} = this.props;
    const formProps = {
      parent,
      userId,
      post,
      del,
      flag,
    };
    return (
      <div>
        {list.map(item => (
          <CommentItem key={item.id} item={item} {...formProps} allowChildren={allowChildren} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let list = [];
  try {
    list = state.news.commentsByParentId[props.parent] || [];
  } catch (err) {
    //
  }

  return {
    list,
  };
};

export default connect(mapStateToProps)(CommentList);


CommentList.propTypes = {
  parent: PropTypes.number,
  userId: PropTypes.number,
  post: PropTypes.func,
  del: PropTypes.func,
  flag: PropTypes.func,
};
