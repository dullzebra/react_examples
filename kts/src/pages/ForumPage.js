import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Layout from '_components/Layout';
import NavBar from '_components/NavBar/NavBar';
import Forum from '_components/Forum/Forum';

class NewsPage extends React.Component {
  render() {
    return (
      <Layout>
        <NavBar value={3}/>
        <Grid>
          <Forum />
        </Grid>
      </Layout>
    );
  }
}

export default NewsPage;
