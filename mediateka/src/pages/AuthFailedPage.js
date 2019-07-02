import React from 'react';
import LayoutAuth from '_pages/LayoutAuth';
import AuthFailed from '_components/Auth/AuthFailed';

const AuthFailedPage = () => {
  return (
    <LayoutAuth>
      <AuthFailed />
    </LayoutAuth>
  );
};

export default AuthFailedPage;
