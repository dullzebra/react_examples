import React from 'react';
import styled from 'styled-components';

const Pane = styled.div`
  max-width: 400px;
  margin: 30px auto;    
`;

const AuthFailed = () => (
  <Pane>
    <h1>Ошибка авторизации</h1>
  </Pane>
);

export default AuthFailed;
