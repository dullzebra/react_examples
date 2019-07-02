import React from 'react';
import { Link } from 'react-router-dom';
import { url } from '_config/url';

const LogoutSuccess = () => {
  return (
    <p>Вы вышли из своей учетной записи. <Link to={url.LOGIN}>Войти</Link></p>
  );
};

export default LogoutSuccess;
