import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import ErrorMessage from '_components/Alert/ErrorMessage';

const LSITEM = 'kts_import';

const GlyphStyled = styled(Glyphicon)`
  font-size: 20px;
`;

const TickStyled = styled(Glyphicon)`
  transform: translateX(-15px);
  margin-right: -11px;
  font-size: 11px;
`;
const ErrorMessageStyled = styled(ErrorMessage)`   
  margin: 0 5px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
`;

const Icon = <GlyphStyled glyph='glyphicon glyphicon-cog' />;

const Active = <TickStyled glyph='glyphicon glyphicon-ok' />;


export default class OrderByFileSettings extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    values: PropTypes.object,
  };

  state = {
    userState: false,
    userValues: null,
    error: false,
  }

  componentDidMount() {
    try {
      const storeStr = localStorage.getItem(LSITEM);
      const storeObj = JSON.parse(storeStr);
      this.updateSettings(storeObj);
    } catch (e) {}
  }

  saveValues = values => {
    const userValues = {...values};
    delete userValues.file;

    const storeObj = {
      userState: true,
      userValues,
    };
    this.updateSettings(storeObj);
  }

  saveState = userState => {
    const {userValues} = this.state;
    const storeObj = {
      userState,
      userValues,
    };
    this.updateSettings(storeObj);
  }

  clear = () => {
    localStorage.removeItem(LSITEM);
    this.updateSettings();
  }

  updateSettings = obj => {
    let storeObj = obj;
    this.hideError();

    if (storeObj) {
      const storeStr = JSON.stringify(storeObj);
      try {
        localStorage.setItem(LSITEM, storeStr);
      } catch (e) {
        this.showError();
        return;
      }
    } else {
      storeObj = {
        userState: false,
        userValues: null,
      };
    }

    this.setState(storeObj);
    const updatedValues = storeObj.userState ? storeObj.userValues : null;
    this.props.onChange(updatedValues);
  }

  showError = () => this.setState({error: 'Не удалось сохранить настройки'})

  hideError = () => this.setState({error: false})

  render() {
    const {userState, userValues, error} = this.state;
    const {values} = this.props;
    return (<Container>
      <ErrorMessageStyled onDismiss={this.hideError}>{error}</ErrorMessageStyled>
      <DropdownButton id='dropdown-settings'
        title={Icon}
        pullRight
      >
        {!userValues && <>
          <MenuItem eventKey='1'>{Active}Настройки по умолчанию</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='2'
            onClick={this.saveValues.bind(this, values)}
          >
            Сохранить мои настройки
          </MenuItem>
        </>}
        {userValues && <>
          <MenuItem eventKey='1'
            onClick={this.saveState.bind(this, false)}
          >
            {!userState && Active}Настройки по умолчанию
          </MenuItem>
          <MenuItem eventKey='2'
            onClick={this.saveState.bind(this, true)}
          >
            {userState && Active}Мои настройки
          </MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='3'
            onClick={this.clear}
          >
            Удалить мои настройки
          </MenuItem>
        </>}
      </DropdownButton>
    </Container>);
  }
}
