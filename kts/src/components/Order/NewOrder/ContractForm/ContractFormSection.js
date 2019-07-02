import React from 'react';
import PropTypes from 'prop-types';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import SelectContractField from './SelectContractField';


const ContractFormSection = ({...props}) => (
  <Row>
    <Col xs={6}>
      <SelectContractField
        label='Договор'
        {...props} />
    </Col>
  </Row>
);

export default ContractFormSection;

ContractFormSection.propTypes = {
  dispatchChangeForm: PropTypes.func,
};
