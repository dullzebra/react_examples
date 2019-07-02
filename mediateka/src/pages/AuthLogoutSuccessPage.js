import React from 'react';
import LayoutAuth from '_pages/LayoutAuth';
import LogoutSuccess from '_components/Auth/LogoutSuccess';

const AuthLogoutSuccessPage = () => {
  return (
    <LayoutAuth>
      <LogoutSuccess />
    </LayoutAuth>
  );
};

export default AuthLogoutSuccessPage;
