import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Layout from '_components/Layout';
import NavBar from '_components/NavBar/NavBar';
import NewOrder from '_components/Order/NewOrder/OrderEditForm';
import withPermissions from '_components/hoc/withPermissions';
const WithPermissionsOrder = withPermissions(NewOrder, 'order');

class OrderPage extends React.Component {
  render() {
    return (
      <Layout>
        <NavBar value={0} />
        <Grid fluid={true}>
          <WithPermissionsOrder />
        </Grid>
      </Layout>
    );
  }
}

export default OrderPage;
