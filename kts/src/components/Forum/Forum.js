import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Redirect} from 'react-router-dom';
import ForumSections from '_components/Forum/ForumSections';
import ForumItem from '_components/Forum/ForumItem';

import {
  getUsers,
  getForumSections,
  getForumTopics,
  getForumItem,
  dispatchForumItem,
  deleteForumTopic,
  loadMoreForumTopics,
} from '_actions';

const actions = {
  getUsers,
  getForumSections,
  getForumTopics,
  getForumItem,
  dispatchForumItem,
  deleteForumTopic,
  loadMoreForumTopics,
};

class Forum extends React.Component {
  state = {
    redirect: false,
  };

  getTopics() {
    const {
      getForumSections,
      getForumTopics,
    } = this.props;

    getForumSections()
      .then(res => {
        res.results.forEach(section => {
          getForumTopics({forum: section.id});
        });
      });
  }

  componentDidMount() {
    const {match: {params: {id}}} = this.props;
    const {getUsers, getForumItem} = this.props;

    getUsers();

    if (id) {
      getForumItem(id)
        .catch(e => this.setState({redirect: true}));
    } else {
      this.getTopics();
    }
  }

  componentDidUpdate(prevProps) {
    const {match: {params: {id}}, forum} = this.props;
    const {match: {params: {id: prevId}}} = prevProps;

    if (prevId && !id) {
      if (!forum.sections.length) {
        this.getTopics();
      }
    }
  }

  showFullItem = (item) => {
    this.props.dispatchForumItem(item);
  };

  removeTopic = item => {
    const {deleteForumTopic} = this.props;
    deleteForumTopic(item);
  };

  render() {
    const {
      match: {
        params: {id},
      },
      forum,
      currentUserId,
      loadMoreForumTopics,
    } = this.props;
    const {redirect} = this.state;

    if (redirect) {
      return <Redirect to='/error'/>;
    }

    if (id) {
      return (
        <>
          {forum.current && forum.current.id &&
          <ForumItem currentUserId={currentUserId} item={forum.current}/>}
        </>
      );
    }

    const showTopics = forum.sections.length > 0
      && forum.sections.length === Object.keys(forum.topicsBySectionId).length;

    return (
      <>
        <h1>Форум</h1>
        {showTopics &&
        <ForumSections
          loadMore={loadMoreForumTopics}
          sections={forum.sections}
          topics={forum.topicsBySectionId}
          showItem={this.showFullItem}
          removeTopic={this.removeTopic}
          currentUserId={currentUserId}
        />}
      </>
    );
  }
}


const mapStateToProps = (state = {}) => {
  const {
    forum,
    ping: {
      user: {
        id: currentUserId,
      },
    },
  } = state;

  return {
    currentUserId,
    forum,
  };
};

export default withRouter(connect(mapStateToProps, actions)(Forum));
