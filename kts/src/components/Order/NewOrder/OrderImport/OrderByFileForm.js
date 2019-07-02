import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {reduxForm, Field, SubmissionError, initialize, getFormValues} from 'redux-form';
import styled from 'styled-components';

import Form from 'react-bootstrap/lib/Form';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import Text from '_formComponents/Text';
import InputFile from '_formComponents/InputFile';
import Settings from '_components/Order/NewOrder/OrderImport/OrderByFileSettings';

import {validateByFile as validate} from '../FormValidate';
import {importOrder} from '_actions';
const actions = {importOrder};

const SettingsStyle = styled.div`
  position: absolute;
  top: -45px;
  right: 15px; 
`;

const FormStyled = styled(Form)`
  padding-right: 15px;
  label {
    margin-top: 8px;
  }
  .form-group {
    margin-right: -15px;    
  }
  .help-block {
    margin: 0;
  }
`;

const formSubmit = (data, _, props) => {
  const {importOrder, onSuccess} = props;
  const formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key]);
  }

  return importOrder(formData)
    .then(order => {
      onSuccess?.(order);
    })
    .catch(() => {
      throw new SubmissionError( {_error: 'Загрузка не удалась. Проверьте содержимое файла'} );
    });
};


class OrderByFileForm extends React.Component {
  changeFormValues = values => {
    const {initialValues, formValues} = this.props;
    const dispatchValues = values || initialValues;
    this.props.dispatch(initialize('OrderByFileForm', {...formValues, ...dispatchValues}));
  }

  render() {
    const {handleSubmit, formValues} = this.props;

    return (<>
      <SettingsStyle>
        <Settings
          values={formValues}
          onChange={this.changeFormValues}
        />
      </SettingsStyle>

      <FormStyled onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <Field name='file' component={InputFile} label='Выбрать файл' />
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='sheet_title' component={Text} />
          </Col>
          <Col xs={9}>
            <ControlLabel>Название листа Excel</ControlLabel>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='row_from' component={Text} type='number'/>
          </Col>
          <Col xs={9}>
            <ControlLabel>Номер строки, с которой начинается таблица</ControlLabel>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='row_to' component={Text} type='number' />
          </Col>
          <Col xs={9}>
            <ControlLabel>Номер строки, которой заканчивается таблица</ControlLabel>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='vendor_code_column' component={Text} />
          </Col>
          <Col xs={9}>
            <ControlLabel>Номер столбца - артикул</ControlLabel>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='year_column' component={Text} />
          </Col>
          <Col xs={9}>
            <ControlLabel>Номер столбца - год</ControlLabel>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Field name='quantity_column' component={Text} />
          </Col>
          <Col xs={9}>
            <ControlLabel>Номер столбца - количество</ControlLabel>
          </Col>
        </Row>
      </FormStyled>
    </>);
  }
}

const mapStateToProps = (state) => {
  return {
    initialValues: {
      sheet_title: 'Sheet',
      row_from: 2,
      row_to: 10000,
      vendor_code_column: 'A',
      quantity_column: 'J',
      year_column: 'G',
    },
    formValues: getFormValues('OrderByFileForm')(state),
  };
};

export default connect(mapStateToProps, actions)(reduxForm({
  form: 'OrderByFileForm',
  onSubmit: formSubmit,
  validate,
})(OrderByFileForm));

OrderByFileForm.propTypes = {
  onSuccess: PropTypes.func,
};
