import React from 'react';
import { FieldArray } from 'redux-form';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import s from './FieldPrices.scss';
import Button from '_uicomponents/Button/Button';
import FieldSimpleInput from '_components/Form/FieldSimpleInput/FieldSimpleInput';

const cx = classNames.bind(s);

class FieldPrices extends React.Component {
  undefOption = {id: null, label: '', price: '', promo: false};

  renderFields = ({ fields }) => {
    let index = 1;
    return (
      <React.Fragment>
        {fields.map((item, i) => {
          const field = fields.get(i);

          if (field.promo) return null;
          return (<div className={cx({FieldPrices: true, deleted: field.deleted})} key={i}>
            <div className={s.FieldPricesNumber}>{field.deleted ? 0 : index++}.</div>
            <div className={s.FieldPricesName}>
              <FieldSimpleInput
                size='size2'
                name={`${item}.label`}
                placeholder={'Период оплаты'}
              />
            </div>
            <div className={s.FieldPricesName}>
              <FieldSimpleInput
                size='size1'
                name={`${item}.price`}
                placeholder={'Цена'}
                normalize={ v => (v && parseInt(v))}
              />
            </div>

            <Button
              bg={'white'}
              onClick={() => fields.remove(i) }
              type='button'
              color='red'
              icon
              short
            >
              <svg>
                <use xlinkHref={'#ic-delete'}/>
              </svg>
            </Button>
          </div>)
          ;
        })}

        <Button
          bg='white'
          onClick={() => fields.push(this.undefOption)}
          type='button'
          icon
          short >
          <svg>
            <use xlinkHref={'#ic-add'}/>
          </svg>
          Добавить
        </Button>
      </React.Fragment>
    );
  }

  render() {
    return (
      <FieldArray name={this.props.name} component={this.renderFields} />
    );
  }
}

FieldPrices.propTypes = {
  name: PropTypes.string.isRequired,
};


export default FieldPrices;
