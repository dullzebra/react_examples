import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Layout from '_components/Layout';
import NavBar from '_components/NavBar/NavBar';
import Order from '_components/Order/MyOrders/Order';
import withPermissions from '_hoc/withPermissions';
const WithPermissionsOrder = withPermissions(Order, 'order');

class OrderPage extends React.Component {
  render() {
    return (
      <Layout>
        <NavBar value={0} />
        <Grid fluid={true}>
          <h1>Мои заказы</h1>
          <WithPermissionsOrder />
        </Grid>
      </Layout>
    );
  }
}

export default OrderPage;
