import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import withModalState from '_hoc/withModalState';

const ModalCentered = styled(Modal)`
  top: 50vh;
  transform: translateY(-50%);
  p {
    margin: 10px 0;
  }
`;

class Confirm extends React.Component {
  onClick = (actionName) => {
    const action = this.props[actionName];
    action && action();

    this.props.close();
  }

  render() {
    const {
      show,
      open,
      close,
      children: trigger,
      title,
      body,
      bsStyle,
    } = this.props;
    return (
      <>
        {trigger(open)}

        <ModalCentered show={show} onHide={close}>
          <Modal.Body>
            {title && <Modal.Title>{title}</Modal.Title>}
            {body && body.map ? body.map((item, i) => <p key={i}>{item}</p>) : <p>{body}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle={bsStyle}
              onClick={this.onClick.bind(null, 'confirm')}>
              Подтвердить
          </Button>
            <Button
              onClick={this.onClick.bind(null, 'cancel')}>
              Отменить
          </Button>
          </Modal.Footer>
        </ModalCentered>
      </>
    );
  }
}

export default withModalState(Confirm);


Confirm.propTypes = {
  children: PropTypes.func.isRequired,
  confirm: PropTypes.func,
  cancel: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  bsStyle: PropTypes.string,
};
