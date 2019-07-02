import React from 'react';
import LayoutAuth from '_pages/LayoutAuth';
import LoginForm from '_components/Auth/LoginForm';

const AuthLoginPage = () => {
  return (
    <LayoutAuth>
      <LoginForm />
    </LayoutAuth>
  );
};

export default AuthLoginPage;
