import React from 'react';
import {connect} from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import NewsList from '_components/News/NewsList';
import NewsItem from '_components/News/NewsItem';
import LoadMore from '_components/LoadMore/LoadMore';

import {getNews, getMoreNews, getNewsItem, dispatchNewsItem} from '_actions';
const actions = {getNews, getMoreNews, getNewsItem, dispatchNewsItem};

class News extends React.Component {
  state = {
    redirect: false,
  }

  componentDidMount() {
    const {match: {params: { id }}} = this.props;
    const { getNews, getNewsItem } = this.props;

    if (id) {
      getNewsItem(id)
        .catch(e => this.setState({redirect: true}));
    } else {
      getNews();
    }
  }

  componentDidUpdate(prevProps) {
    const {match: {params: { id }}, getNews, news} = this.props;
    const {match: {params: { id: prevId }}} = prevProps;

    if (prevId && !id) {
      if (!news.list.length) {
        getNews();
      }
    }
  }

  showFullItem = (item) => {
    this.props.dispatchNewsItem(item);
  }

  render() {
    const {match: {params: { id }}, news, getMoreNews} = this.props;
    const {redirect} = this.state;

    if (redirect) {
      return <Redirect to='/error' />;
    }

    if (id) {
      return (
      <>
      {news.current && news.current.id &&
      <NewsItem item={news.current} />}
      </>
      );
    }

    return (
      <>
      <h1>Новости</h1>
      <NewsList list={news.list} showFullItem={this.showFullItem} />
      <LoadMore next={news.next} loadMore={getMoreNews}/>
      </>
    );
  }
}


const mapStateToProps = (state = {}) => {
  const {news} = state;
  return {
    news,
  };
};

export default withRouter(connect(mapStateToProps, actions)(News));
