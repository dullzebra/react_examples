import React from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {reduxForm, FieldArray, getFormValues, SubmissionError, change, initialize} from 'redux-form';

import Form from 'react-bootstrap/lib/Form';

import ContractFormSection from '_components/Order/NewOrder/ContractForm/ContractFormSection';
import ProductFormSection from '_components/Order/NewOrder/ProductForm/ProductFormSection';
import OrderFormButtons from '_components/Order/NewOrder/OrderFormButtons';
import ErrorMessage from '_components/Alert/ErrorMessage';
import SuccessMessage from '_components/Alert/SuccessMessage';
import WarningMessage from '_components/Alert/WarningMessage';
import Loader from '_components/Loader/Loader';

import {validateByHand as validate, warnByHand as warn} from './FormValidate';

import {postNewOrder, getProducts, patchOrder} from '_actions';
const actions = {postNewOrder, getProducts, patchOrder};
import {path} from '_config/url';
import keyBy from 'lodash/keyBy';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
//import moment from 'moment';

import {
  selectLocationStateContract,
  selectLocationStateItemsById,
  selectLocationStateItemsKeys,
} from '_selectors';


class OrderByHandForm extends React.Component {
  state= {
    contractSelected: false,
    submitWarning: null,
    contractItemsWarning: null,
    contractItemsLoading: false,
    previewMode: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.contractSelected
      &&
      nextProps.formValues?.contract
    ) {
      return {contractSelected: true};
    }
    return null;
  }

  togglePreview = e => {
    e.preventDefault();
    this.setState( prevState => ({previewMode: !prevState.previewMode}) );
  };

  goBack = () => this.props.history.push(path.order);

  formSubmit = async (data) => {
    const {postNewOrder, patchOrder, history: {location: {state}}} = this.props;
    let postResult, deleteResult;

    const formData = {...data};
    formData.items = data.items.filter(item => item.quantity > 0 && !item.incorrect);

    try {
      postResult = await postNewOrder(formData);

      // If need to delete positions
      if (state && state.deletePositions) {
        const [id, order] = state.deletePositions;
        deleteResult = await patchOrder(id, order);
      }

      setTimeout(this.goBack, 1000);
    } catch (err) {
      if (!postResult) {
        throw new SubmissionError( {_error: 'При отправке заказа произошла ошибка. Попробуйте еще раз'} );
      }

      if (!deleteResult) {
        this.setState( {submitWarning: 'Новый заказ сформирован, но не удалось удалить позиции из старого заказа. Вернитесь к списку заказов и попробуйте сделать это вручную'} );
      }
    }
  }

  //if no initialValues set for the field, put 'value' as initial for 'field'
  dispatchInitForm = (field, value) => {
    const {initialValues} = this.props;

    if (!initialValues[field]) {
      this.dispatchChangeForm(field, value);
    }
  }

  dispatchChangeForm = (field, value) => {
    this.props.dispatch(change('OrderByHandForm', field, value));
  }

  /**
   * New logic:
   *  1) products imported from .xls can be not included in current contract -> find difference and show warning
   *  2) if user selected some products and changed contract then -> find difference with new contract and show warning
   */
  initializeProductItems = contractId => {
    const {formValues, contractsById, initialItemsId, initialItemsById, productsById, getProducts} = this.props;
    const contractItems = contractsById[contractId]?.items || {};

    if (isEmpty(contractItems)) {
      return {
        contract: formValues.contract,
        items: [],
      };
    }

    const contractItemsId = Object.keys(contractItems);
    // When contracts was changed collect previous items with quantity > 0
    const prevItems = formValues.items?.filter(item => +item.quantity > 0) || [];
    const prevItemsById = keyBy(prevItems, 'product');

    // Find items that differ from contract items
    const diffPrevItems = difference(Object.keys(prevItemsById), contractItemsId);
    const diffInitialItems = difference(initialItemsId, contractItemsId);

    if (diffInitialItems.length) {
      getProducts({id: diffInitialItems});
    }

    // Compose all diff items
    let incorrectItems = uniq([...diffInitialItems, ...diffPrevItems]);

    if (incorrectItems.length) {
      this.setState( {contractItemsWarning: 'Заказ содержит позиции, которых нет в указанном договоре. Они не будут учтены при оформлении заказа.'} );

      incorrectItems = incorrectItems.map(id => ({
        product: id,
        quantity: getQuantity(id),
        price: 'не определена',
        incorrect: true,
      }));
    }

    // Read all products and fill in the initial quantity
    const productItems = [...incorrectItems];
    for (const id in contractItems) {
      const initialProduct = {
        ...contractItems[id],
        quantity: getQuantity(id),
        in_stock: productsById[id].in_stock,
      };
      productItems.push(initialProduct);
    }
    return {
      contract: formValues.contract,
      items: productItems,
    };


    function getQuantity(id) {
      return prevItemsById[id]?.quantity
      ||
      initialItemsById[id]?.quantity
      ||
      0;
    }
  }

  componentDidUpdate(prevProps) {
    const {formValues: prevFormValues} = prevProps;
    const {formValues, getProducts} = this.props;

    // on contract changed initialize product form with new items values
    if (formValues.contract && (!prevFormValues || formValues.contract !== prevFormValues.contract)) {
      this.setState({
        contractItemsWarning: null,
        contractItemsLoading: true,
      });
      return getProducts({ contracts: formValues.contract })
        .then(() => {
          this.props.dispatch(initialize('OrderByHandForm', this.initializeProductItems(formValues.contract)));
          this.setState({
            contractItemsLoading: false,
          });
        });
    }
  }


  render() {
    const {
      contractSelected,
      submitWarning,
      contractItemsWarning,
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

    const actions = <OrderFormButtons
      previewMode={previewMode}
      previewDisabled={!contractSelected}
      submitDisabled={submitting}
      togglePreview={this.togglePreview}
      cancelOrder={this.goBack}
    />;

    return (
      <>
      {submitSucceeded && !submitWarning && <SuccessMessage>Заказ успешно сформирован!</SuccessMessage>}

      {submitSucceeded && submitWarning && <WarningMessage>{submitWarning}</WarningMessage>}

      {!submitSucceeded && <>
      <h1>Новый заказ</h1>
      <Form onSubmit={handleSubmit(this.formSubmit)}>
        <ContractFormSection
          dispatchChangeForm={this.dispatchInitForm}
          disabled={previewMode}
        />

        {!previewMode && contractItemsWarning &&
          <WarningMessage>{contractItemsWarning}</WarningMessage>}

        {!contractSelected &&
          <p>Для создания заказа выберите договор</p>}

        {contractItemsLoading &&
          <Loader label='Загрузка продуктов' />}

        {contractSelected && !contractItemsLoading &&
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

const mapStateToProps = (state, props) => {
  const initialValues = {
    contract:  selectLocationStateContract(state, props),
    items: null,
  };

  return {
    initialValues,
    formValues: getFormValues('OrderByHandForm')(state),
    contractsById: state.contracts,
    productsById: state.productsById,
    // Here we store items moved from other order or imported form .xls
    initialItemsById: selectLocationStateItemsById(state, props),
    initialItemsId: selectLocationStateItemsKeys(state, props),
  };
};

export default withRouter(
  connect(mapStateToProps, actions)(reduxForm({
    form: 'OrderByHandForm',
    validate,
    warn,
    touchOnBlur: false,
  })(OrderByHandForm))
);
