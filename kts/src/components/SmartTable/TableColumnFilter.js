import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Modal from 'react-bootstrap/lib/Modal';

import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import every from 'lodash/every';

import Tooltip from '_components/Tooltip/Tooltip';
import withModalState from '_components/Modal/withModalState';
import ErrorMessage from '_components/Alert/ErrorMessage';

const List = styled.div`
  display: flex;
  flex-wrap: wrap; 
  max-height: 300px;
  overflow: auto;
`;

const ListItem = styled.div`
  flex-basis: 33%;
  padding: 5px 0;
`;

const FooterCheckbox = styled(Checkbox)`
  float: left;
  margin-top: 5px;
  margin-bottom: 0;
`;

const ErrorMessageStyled = styled(ErrorMessage)`   
  position: absolute;
  bottom: 0px;
  right: 15px;
`;

const ModalCentered = styled(Modal)`
  top: 50vh;
  transform: translateY(-50%);
`;

let LSITEM = 'kts_details';

const TableColumnFilterModal = withModalState(class FilterModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    open: PropTypes.func,
    close: PropTypes.func,
    children: PropTypes.func.isRequired,
    colummns: PropTypes.object,
    onSave: PropTypes.func,
    lsItem:  PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }

  state = {
    all: false, // true if all colums are true, false otherwise
    columns: {
      // key: true|false,
    },
    error: null,
  }

  componentDidMount() {
    let storeColumns = null;

    if (this.props.lsItem && this.props.lsItem.length) {
      LSITEM = `kts_${this.props.lsItem}`;
    }

    try {
      const storeStr = localStorage.getItem(LSITEM);
      storeColumns = JSON.parse(storeStr);
    } catch (e) {
      //
    } finally {
      const columns = mapValues(this.props.columns, () => true);


      // If columns were stored in LS, map props values to stored values
      if (storeColumns) {
        for (const key in columns) {
          if (storeColumns.hasOwnProperty(key) && storeColumns[key] !== undefined) {
            columns[key] = storeColumns[key];
          } else {
            columns[key] = true;
          }
        }
      }

      this.setState({
        columns,
        all: every(columns, v => v),
      });

      this.props.onSave(this.filterPropColumns(storeColumns));
    }
  }

  filterPropColumns = filterKeys => {
    const columns = {...this.props.columns};

    if (!filterKeys) return columns;

    for (const key in filterKeys) {
      if (filterKeys[key] === false && key !== 'id') {
        delete columns[key];
      }
    }

    return columns;
  }

  saveColumns = () => {
    const selected = this.state.columns;
    const columns = this.filterPropColumns(selected);

    this.hideError();
    try {
      const storeStr = JSON.stringify(selected);
      localStorage.setItem(LSITEM, storeStr);
      this.props.onSave(columns);
      this.props.close();
    } catch (e) {
      this.showError();
    }
  }

  toggleColumn(key) {
    this.setState(prevState => {
      const columns = {
        ...prevState.columns,
        [key]: !prevState.columns[key],
      };
      return {
        columns,
        all: every(columns, v => v),
      };
    });
  }

  toggleAll() {
    this.setState(prevState => {
      const checkedState = !prevState.all;
      const columns = mapValues(prevState.columns, () => checkedState);
      return {
        columns,
        all: every(columns, v => v),
      };
    });
  }


  renderColumnList = () => {
    let columnsList = {...this.props.columns};
    delete columnsList.id;

    columnsList = map(columnsList, (value, key) => {
      const isChecked = this.state.columns[key];
      const name = typeof value === 'object' ? value.name : value;
      return (
        <ListItem key={key}>
          <Checkbox inline
            checked={isChecked}
            onChange={this.toggleColumn.bind(this, key)}>
            {name}
          </Checkbox>
        </ListItem>);
    });

    return <List>{columnsList}</List>;
  }


  showError = () => this.setState({error: 'Не удалось сохранить настройки'})

  hideError = () => this.setState({error: false})


  render() {
    const {
      show,
      open,
      close,
      children,
    } = this.props;

    return (<>
      {children(open)}

      <ModalCentered show={show} onHide={close} style={{minHeight: 400}}>
        <Modal.Header>
          <Modal.Title>
            Какие столбцы отображать в таблице?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderColumnList()}
          <ErrorMessageStyled onDismiss={this.hideError}>{this.state.error}</ErrorMessageStyled>
        </Modal.Body>
        <Modal.Footer>
          <FooterCheckbox
            checked={this.state.all}
            onChange={this.toggleAll.bind(this)}
          >
            Все
          </FooterCheckbox>
          <Button
            bsStyle='info'
            onClick={() => this.saveColumns()}
          >
          Сохранить
          </Button>
          <Button onClick={close}>
          Закрыть
          </Button>
        </Modal.Footer>
      </ModalCentered>
    </>);
  }
});


const TableColumnFilter = ({
  head,
  onChange,
  lsItem,
}) => (
  <TableColumnFilterModal columns={head} onSave={onChange} lsItem={lsItem}>
    {showModal =>
      <Tooltip tooltip='Настроить вид таблицы'>
        <Button
          bsStyle='link'
          onClick={showModal}
        >
          <Glyphicon glyph='glyphicon glyphicon-filter'/>
        </Button>
      </Tooltip>
    }
  </TableColumnFilterModal>
);

TableColumnFilter.propTypes = {
  head: PropTypes.object,
  onChange: PropTypes.func,
  lsItem:  PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default TableColumnFilter;
