import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OrderByFileModal from '_components/Modal/OrderByFile';

import url, {path} from '_config/url';
import { selectContractNumbers } from '_selectors';

const Sign = styled(Glyphicon)`
  margin-right: 5px;
`;

class CreateButtons extends React.Component {
  downloadTemplateLink = contractId => {
    try {
      return `${url.orderTemplate}`.replace('{ID}', contractId);
    } catch (e) {
    //
    }
  }

  importOrder = data => {
    const {history} = this.props;
    history.push({
      pathname: path.orderNew,
      state: data,
    });
  }

  render() {
    const {contracts} = this.props;

    return (
      <DropdownButton
        dropup
        bsStyle='primary'
        title={<><Sign glyph='glyphicon glyphicon-plus' />Создать заказ</>}
        id='NewOrderButton'>

        {contracts.map( (c, i) =>
          <MenuItem
            key={i}
            eventKey={i + 3}
            href={this.downloadTemplateLink(c.id)}
          >
            <Sign glyph='glyphicon glyphicon-save' />Скачать Excel-шаблон заказа{c.number && ` (${c.number})`}
          </MenuItem> )}

        <MenuItem divider />
        <OrderByFileModal onSuccess={this.importOrder}>
          { showModal => <MenuItem eventKey='2' onClick={showModal}><Sign glyph='glyphicon glyphicon-open' />Загрузить из Excel-файла</MenuItem> }
        </OrderByFileModal>

        <MenuItem divider />
        <MenuItem
          eventKey='1'
          componentClass={Link}
          href={path.orderNew} to={path.orderNew}
        ><Sign glyph='glyphicon glyphicon-list' />Сформировать вручную</MenuItem>

      </DropdownButton>

    );
  }
}

const mapStateToProps = (state = {}) => {
  return {
    contracts: selectContractNumbers(state),
  };
};


export default withRouter(connect(mapStateToProps)(CreateButtons));

CreateButtons.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.string,
  })),
};
