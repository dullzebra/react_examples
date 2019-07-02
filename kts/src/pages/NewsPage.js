import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Layout from '_components/Layout';
import NavBar from '_components/NavBar/NavBar';
import News from '_components/News/News';

class NewsPage extends React.Component {
  render() {
    return (
      <Layout>
        <NavBar value={2}/>
        <Grid>
          <News />
        </Grid>
      </Layout>
    );
  }
}

export default NewsPage;
