import React from 'react';
import { connect } from 'react-redux';
import {reduxForm, submit} from 'redux-form';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import ErrorMessage from '_components/Alert/ErrorMessage';
import SuccessMessage from '_components/Alert/SuccessMessage';

const Info = styled.div`
  float: left;
  .alert{
    margin: 0;
    padding-top: .5em;
    padding-bottom: .5em;
  }
`;

const OrderByFileSubmit = ({ dispatch, error, submitSucceeded, submitting }) => {
  return (
    <>
    <Info>
      <ErrorMessage>{error}</ErrorMessage>
      {/*   {submitSucceeded && <SuccessMessage>Загрузка заказа прошла успешно!</SuccessMessage>} */}
    </Info>
    <Button
      bsStyle='success'
      disabled={submitting}
      onClick={() => dispatch(submit('OrderByFileForm'))}>Загрузить</Button>
    </>
  );
};

export default connect()(reduxForm({
  form: 'OrderByFileForm',
})(OrderByFileSubmit));
