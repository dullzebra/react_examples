import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Field} from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import filter from 'lodash/filter';

import Select from '_formComponents/Select/Select';

import {getContracts} from '_actions';
const actions = {getContracts};

class FieldSelectContract extends React.Component {
  componentDidMount() {
    const {contracts, getContracts, selected, dispatchChangeForm} = this.props;

    if (selected) {
      dispatchChangeForm?.('contract', selected.id);
      const c = selected;
      this.setState({
        contractOptions: [{
          value: c.id,
          label: `${c.number}` + (c.description && ` (${c.description})`),
        }],
      });
      return;
    }

    const promise = isEmpty(contracts) ? getContracts() : Promise.resolve();
    promise.then(() => {
      this.setState({
        contractOptions: this.makeContractOptionsFromProps(),
      });
    });
  }

  makeContractOptionsFromProps = () => {
    const {contracts, dispatchChangeForm} = this.props;

    const notEmptyContracts = filter(contracts, (c => c.is_available));

    // If only one contract, fill in this field now
    if (notEmptyContracts.length === 1) {
      dispatchChangeForm?.('contract', +notEmptyContracts[0]);
    }

    return map(notEmptyContracts, (c => ({
      value: c.id,
      label: `${c.number}` + (c.description && ` (${c.description})`),
    })
    ));
  }

  state = {
    contractOptions: [],
  }

  render() {
    const {contractOptions} = this.state;


    return (
      <Field
        name={'contract'}
        placeholder='Выберите договор'
        options={contractOptions}
        component={Select}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contracts: state.contracts,
  };
};

export default connect(mapStateToProps, actions)(FieldSelectContract);

FieldSelectContract.propTypes = {
  dispatchChangeForm: PropTypes.func,
};
