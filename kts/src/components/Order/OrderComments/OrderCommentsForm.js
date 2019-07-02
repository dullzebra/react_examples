import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import styled from 'styled-components';

import Form from 'react-bootstrap/lib/Form';
import Button from 'react-bootstrap/lib/Button';
import Textarea from '_formComponents/Textarea';
import ErrorMessage from '_components/Alert/ErrorMessage';

import {getOrderComments} from '_actions';
const actions = {getOrderComments};

const ErrorMessageStyled = styled(ErrorMessage)`
  float: left;
  margin: 0 5px;
  padding: 7px;
`;

const validate = values => {
  if (!values.comment || !values.comment.trim()) {
    return {comment: 'Напишите что-нибудь'};
  }
  return {};
};

class OrderCommentsForm extends React.Component {
  formSubmit = data => {
    this.props.reset();
    return this.props.post(data)
      .catch(() => {
        throw new SubmissionError({_error: 'Не отправлено'});
      });
  };

  render() {
    const {handleSubmit, submitting, error, invalid} = this.props;

    return (
      <Form onSubmit={handleSubmit(this.formSubmit)}>
        <Field
          name='comment'
          component={Textarea}
          placeholder='Ваше сообщение'
          showErrors={false}
        />
        <Button
          bsStyle='success'
          className='pull-right'
          disabled={submitting || invalid}
          type='submit'
        >Отправить</Button>
        <ErrorMessageStyled>{error}</ErrorMessageStyled>
      </Form>
    );
  }
}

export default connect(null, actions)(reduxForm({
  form: 'OrderCommentsForm',
  validate,
})(OrderCommentsForm));


OrderCommentsForm.propTypes = {
  post: PropTypes.func.isRequired,
};
