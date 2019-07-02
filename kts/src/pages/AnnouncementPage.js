import React from 'react';
import Layout from '_components/Layout';
import NavBar from '_components/NavBar/NavBar';
import Grid from 'react-bootstrap/lib/Grid';
import Exchange from '_components/Announcement/Announcement';
import withPermissions from '_hoc/withPermissions';
const WithPermissionsExchange = withPermissions(Exchange, 'announcement');

class AnnouncementPage extends React.Component {
  render() {
    return (
      <Layout>
        <NavBar value={1} />
        <Grid fluid>
          <WithPermissionsExchange />
        </Grid>
      </Layout>
    );
  }
}

export default AnnouncementPage;
