import React from 'react';
import PropTypes from 'prop-types';
import {reduxForm, Field, SubmissionError} from 'redux-form';
import styled from 'styled-components';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import Textarea from '_formComponents/Textarea';
import ErrorMessage from '_components/Alert/ErrorMessage';

const Form = styled.form`
  max-width: 400px;
  margin-top: 2px;
`;

const validate = (values) => {
  const errors = {};

  if (!values.comment || !values.comment.trim()) {
    errors.comment = 'Напишите что-нибудь';
  }
  return errors;
};

class CommentForm extends React.PureComponent {
 formSubmit = (data) => {
   const {parent, post, onSubmit} = this.props;
   return post({
     ...data,
     parent,
   })
     .then(() => {
       if (onSubmit) {
         onSubmit();
       }
     })
     .catch(res => {
       if (res && res.data && res.data.comment) {
         throw new SubmissionError({comment: res.data.comment[0]});
       }
       throw new SubmissionError( {_error: 'При отправке сообщения произошла ошибка'});
     });
 }

 formCancel = () => {
   const {onCancel, reset} = this.props;
   reset();
   onCancel();
 }

 render() {
   const {handleSubmit, error, submitting, onCancel} = this.props;
   return (
     <Form onSubmit={handleSubmit(this.formSubmit)}>
       <Field name='comment' placeholder='Ваше сообщение' component={Textarea} />
       <ButtonToolbar>
         <Button type='submit' bsStyle='primary' bsSize='small'>Отправить</Button>
         {!!onCancel && <Button bsStyle='default' bsSize='small' onClick={this.formCancel}>Отменить</Button>}
       </ButtonToolbar>
       {!submitting && <ErrorMessage>{error}</ErrorMessage>}
     </Form>
   );
 }
}

export default reduxForm({
  validate,
})(CommentForm);

CommentForm.propTypes = {
  form: PropTypes.string.isRequired,
  parent: PropTypes.number,
  post: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

