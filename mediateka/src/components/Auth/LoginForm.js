import React, { useState } from 'react';
import withConnect from '_containers/withConnect';

const LoginForm = props => {
  const [form, setFormValue] = useState({ username: '', password: '' });

  const onChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setFormValue(form => ({ ...form, [name]: value }));
  };

  const onSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.username = form.username;
    formData.passowrd = form.password;
    props.userLogin(formData);
  };

  return (
    <div className='form'>
      <form method='post' onSubmit={onSubmit}>
        <div className='input-field'>
          <label htmlFor='id_username' className='active'>Имя пользователя:</label>
          <input
            type='text'
            name='username'
            value={form.username}
            onChange={onChange}
          />
        </div>
        <div className='input-field'>
          <label htmlFor='id_password' className='active'>Пароль:</label>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={onChange}
          />
        </div>
        <div>
          <input type='submit' value='Войти' className='btn purple darken-4 left' />
          <p className='right'><a href='/accounts/password_reset/'>Забыли пароль?</a></p>
        </div>
      </form>
    </div>
  );
};

export default withConnect(LoginForm, ['userLogin']);
