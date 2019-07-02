import React from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {reduxForm, FieldArray, SubmissionError, change, initialize} from 'redux-form';

import Form from 'react-bootstrap/lib/Form';

import ContractFormSection from '_components/Order/NewOrder/ContractForm/ContractFormSection';
import ProductFormSection from '_components/Order/NewOrder/ProductForm/ProductFormSection';
import OrderFormButtons from '_components/Order/NewOrder/OrderFormButtons';
import ErrorMessage from '_components/Alert/ErrorMessage';
import SuccessMessage from '_components/Alert/SuccessMessage';
import Loader from '_components/Loader/Loader';

import {validateByHand as validate, warnByHand as warn} from './FormValidate';

import {getProducts, patchOrder, getOrder, getContract} from '_actions';
const actions = {getProducts, patchOrder, getOrder, getContract};
import {path} from '_config/url';
import keyBy from 'lodash/keyBy';


class OrderEditForm extends React.Component {
  state= {
    accessError: null,
    order: null,
    contractItemsLoading: false,
    previewMode: false,
  }

   togglePreview = e => {
     e.preventDefault();
     this.setState( prevState => ({previewMode: !prevState.previewMode}) );
   };

  goBack = () => this.props.history.push(path.order);

  formSubmit = async (data) => {
    const {patchOrder} = this.props;
    const {order: {id}} = this.state;
    let postResult;

    const formData = {...data};
    formData.items = data.items.filter(item => item.quantity > 0);

    try {
      postResult = await patchOrder(id, formData);
      setTimeout(this.goBack, 1000);
    } catch (err) {
      if (!postResult) {
        throw new SubmissionError( {_error: 'При сохранении заказа произошла ошибка. Попробуйте еще раз'} );
      }
    }
  }

  dispatchChangeForm = (field, value) => {
    this.props.dispatch(change('OrderEditForm', field, value));
  }

  initializeProductItems = (order, contract) => {
    const {productsById} = this.props;
    const orderItemsByProduct = keyBy(order.items, 'product');
    return {
      items: contract.items.map(item => {
        const orderItem = orderItemsByProduct[item.product];
        return {
          ...item,
          in_stock: productsById[item.product]?.in_stock,
          quantity: orderItem?.quantity || 0,
        };
      }),
    };
  }

  componentDidMount = async () => {
    const {getOrder, getContract, getProducts, match: {params: {id}}} = this.props;

    const order = await getOrder(id)
      .catch(() => this.setState({
        accessError: 'Такого заказа не найдено',
      }));

    if (order.status !== 'new') {
      return this.setState({
        accessError: 'Этот заказ отправлен менеджеру. Вы не можете его редактировать',
      });
    }

    this.setState({
      order,
      contractItemsLoading: true,
    });

    const [contract] = await Promise.all([
      getContract(order.contract),
      getProducts({contracts: order.contract}),
    ])
      .catch(() => {
        this.setState({
          contractItemsLoading: false,
          accessError: 'Не удалось загрузить данные по заказу',
        });
      });

    this.props.dispatch(initialize('OrderEditForm', this.initializeProductItems(order, contract)));
    this.setState({
      contract,
      contractItemsLoading: false,
    });
  }


  render() {
    const {
      accessError,
      order,
      contract,
      contractItemsLoading,
      previewMode,
    } = this.state;

    const {
      productsById,
      handleSubmit,
      error,
      anyTouched,
      submitting,
      submitSucceeded,
    } = this.props;

    if (accessError) {
      return <ErrorMessage>{accessError}</ErrorMessage>;
    }

    const actions = <OrderFormButtons
      previewMode={previewMode}
      previewDisabled={false}
      submitDisabled={submitting}
      togglePreview={this.togglePreview}
      cancelOrder={this.goBack}
    />;

    return (
      <>
      {submitSucceeded && <SuccessMessage>Заказ успешно сохранен!</SuccessMessage>}

      {!submitSucceeded && <>
      <h1>Редактирование заказа {order && order.number && '№ ' + order.number}</h1>

      {contractItemsLoading &&
        <Loader label='Загрузка продуктов' />}

      {contract &&
        <ContractFormSection
          dispatchChangeForm={this.dispatchChangeForm}
          selected={contract}
          disabled={true}
        />}

      <Form onSubmit={handleSubmit(this.formSubmit)}>
        {contract && !contractItemsLoading &&
          <FieldArray name='items'
            component={ProductFormSection}
            productsById={productsById}
            touched={anyTouched}
            previewMode={previewMode}
            dispatchChangeForm={this.dispatchChangeForm}
          >
            {actions}
          </FieldArray>}

        {!submitting &&
          <ErrorMessage>{error}</ErrorMessage>}
      </Form>
      </>}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productsById: state.productsById,
  };
};

export default withRouter(
  connect(mapStateToProps, actions)(reduxForm({
    form: 'OrderEditForm',
    validate,
    warn,
    touchOnBlur: false,
  })(OrderEditForm))
);
