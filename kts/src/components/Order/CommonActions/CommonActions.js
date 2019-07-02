import React from 'react';
import styled from 'styled-components';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ExportButton from '_components/Order/CommonActions/ExportButton';
import RefreshButton from '_components/Order/CommonActions/RefreshButton';
import ToggleClosedButton from '_components/Order/CommonActions/ToggleClosedButton';

const ButtonToolbarStyled = styled(ButtonToolbar)`   
  button, a{
    padding: 5px;   
  }
`;

const CommonActions = () => (
  <ButtonToolbarStyled>
    <ToggleClosedButton />
    <ExportButton />
    <RefreshButton />
  </ButtonToolbarStyled>
);

export default CommonActions;

