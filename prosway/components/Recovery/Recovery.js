import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '_actions';
import Input from '_uicomponents/Input/Input.js';
import Button from '_uicomponents/Button/Button.js';
import s from './Recovery.scss';

const validate = values => {
  const errors = {};

  if (!values.new_password) {
    errors.new_password = 'Пароль не может быть пустым';
  }

  if (!values.new_password2) {
    errors.new_password2 = 'Пароль не может быть пустым';
  }

  if ((values.new_password && values.new_password2)
   && values.new_password !== values.new_password2) {
    errors.new_password = 'Введенные пароли не совпадают';
    errors.new_password2 = 'Введенные пароли не совпадают';
  }
  return errors;
};

class Recovery extends React.Component {
  formSubmit = data => {
    const { userPasswordReset, ping, redirect, params: {user, token} } = this.props;

    return userPasswordReset(user, token, data)
      .then(() => {
        ping();
        redirect('/');
      })
      .catch(error => {
        let errorText;

        if (error.token || error.details) {
          errorText = 'Установить пароль не удалась. Cсылка на эту страницу неверна или больше не действительна';
        } else if (error.non_field_errors) {
          errorText = 'Мы не можем установить такой пароль — он слишком простой или слишком короткий';
        } else {
          errorText = 'Пароли не совпадают или пустые, или с ними еще что-то не так';
        }
        throw new SubmissionError({
          _error: errorText,
        });
      });
  }

  render() {
    const {handleSubmit, error} = this.props;

    return (
      <div className={s.Recovery}>
        <div className={s.Top}>
          <h1>Восстановление пароля</h1>
        </div>
        <div className={s.ContentWrap}>
          <div className={s.Content}>
            <div className={s.Description}>Придумайте новый пароль.
            Он должен содержать как минимум 8&nbsp;символов и не должен состоять только из цифр.</div>
            <form onSubmit={handleSubmit(this.formSubmit)}>
              <div className={s.Field}>
                <Field
                  name='new_password'
                  component={Input}
                  type='password'
                  label='Новый пароль'
                  placeholder='Новый пароль'
                />
              </div>
              <div className={s.Field}>
                <Field
                  name='new_password2'
                  component={Input}
                  type='password'
                  label='Новый пароль еще раз'
                  placeholder='Новый пароль еще раз'
                />
              </div>
              {error && <div className={s.Error}>{error}</div>}
              <Button type={'submit'}>Сохранить</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Recovery.propTypes = {
  params: PropTypes.shape({ user: PropTypes.string, token: PropTypes.string}),
  redirect: PropTypes.func,
};

export default connect(null, actions)(
  reduxForm({
    form: 'Recovery',
    validate,
  })(Recovery)
);


export const TestForm = reduxForm({
  form: 'Recovery',
})(Recovery);

