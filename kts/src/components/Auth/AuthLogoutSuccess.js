import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import url from '_config/url';
import {connect} from 'react-redux';

const Pane = styled.div`
  max-width: 400px;
  margin: 30px auto;    
`;

class AuthLogoutSuccess extends React.Component {
  render() {
    return (
      <Pane>
        <h1>Вы успешно вышли.</h1>
        <p><Link to={url.login}>Войти</Link></p>
      </Pane>
    )
  }
};

export default AuthLogoutSuccess;