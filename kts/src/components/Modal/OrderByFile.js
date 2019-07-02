import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import OrderByFileForm from '_components/Order/NewOrder/OrderImport/OrderByFileForm';
import OrderByFileSubmit from '_components/Order/NewOrder/OrderImport/OrderByFileSubmit';
import withModalState from '_hoc/withModalState';

const ModalCentered = styled(Modal)`
  top: 50vh;
  transform: translateY(-50%);
`;

class OrderByFileModal extends React.Component {
  onFormSubmit = data => {
    this.props.onSuccess(data);
  }

  render() {
    const {
      show,
      open,
      close,
      children: trigger,
    } = this.props;
    return (
      <>
        {trigger(open)}

        <ModalCentered show={show} style={{ height: 650 }}>
          <Modal.Header>
            <Modal.Title>Загрузка из Excel-файла</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OrderByFileForm onSuccess={this.onFormSubmit} />
          </Modal.Body>
          <Modal.Footer>
            <OrderByFileSubmit />
            <Button onClick={close}>Отменить</Button>
          </Modal.Footer>
        </ModalCentered>
      </>
    );
  }
}

export default withModalState(OrderByFileModal);


OrderByFileModal.propTypes = {
  children: PropTypes.func.isRequired,
};
