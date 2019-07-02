import React from 'react';
import {Field} from 'redux-form';
import styled from 'styled-components';
import classNames from 'classnames';

import Table from 'react-bootstrap/lib/Table';
import Text from '_formComponents/Text';
import ProductRow from './ProductFormRow';

import map from 'lodash/map';
import {formatNumber, declineDesimalNoun} from '_utils';
import {
  grayLight,
} from '!!sass-variable-loader!_sassVars';

const NoProductTable = styled.div`
  margin: 30px 0;
`;

const ProductTable = styled(Table)`
  th > .form-group{
    margin-bottom: 0;
    max-width: 200px;
  }
  tr:first-child > th {
    border-bottom: none;
  }
  tr.warning {
    color: ${grayLight}
  } 
`;

const Total = styled.span`
  font-weight: bold;
`;

const TotalLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const tableHead = {
  index: {name: '', width: 10},
  quantity: {name: 'Кол-во, шт', width: 100},
  in_stock: {name: 'На складе', width: 80},
  vendor_code: {name: 'Артикул', width: 150, filter: true},
  isbn: {name: 'ISBN', width: 150, filter: true},
  name: {name: 'Наименование продукта', width: '15%', filter: true},
  product_line: {name: 'Линейка', width: 150, filter: true},
  authors: {name: 'Авторы', width: 150, filter: true},
  product_type: {name: 'Тип', width: 150, filter: true},
  novelty: {name: 'Новинка', width: '1%'},
  year: {name: 'Год', width: '1%'},
  price_group: {name: 'Группа', width: 150, filter: true},
  price: {name: 'Стоимость, руб.', width: '1%'},
};

class ProductFormSection extends React.Component {
  state = {
    hideMap: this.initFilterState(),
  }

  componentDidUpdate(prevProps) {
    if (this.props.previewMode !== prevProps.previewMode) {
      this.resetFilter();
    }
  }

  resetFilter = () => {
    const {dispatchChangeForm} = this.props;
    for (const key in tableHead) {
      if (tableHead[key].filter) {
        dispatchChangeForm(key, '');
      }
    }
    this.setState({ hideMap: this.initFilterState() });
  }

  initFilterState() {
    const filterKeys = {};
    map( tableHead, (val, key) => {
      if (val.filter) {
        // value of array equals 'true' if product of 'index' does not match the filter
        filterKeys[key] = [];
      }
    });
    return filterKeys;
  }

  // calculate total order cost as sum of cost*number
  calculateTotal = (products) => {
    return products
      .reduce((acc, cur) => acc + (isNaN(cur.price) ? 0 : cur.price) * cur.quantity, 0);
  }

  calculateAmount = (products) => {
    return products
      .reduce((acc, cur) => acc + (cur.incorrect ? 0 : +cur.quantity), 0);
  }

 renderTotal = () => {
   const fields = this.props.fields.getAll();

   if (!fields) return;
   const amount = this.calculateAmount(fields);
   return <Total>
     Итого:&nbsp;
     {formatNumber(amount)}&nbsp;{declineDesimalNoun(amount, ['штука', 'штуки', 'штук'])}
     &nbsp;на&nbsp;
     {formatNumber(this.calculateTotal(fields))}&nbsp;руб.
   </Total>;
 }


 filterProducts = (e, val, prevVal, inputName) => {
   try {
     const {productsById, fields} = this.props;
     const filterKey = inputName;
     const value = val?.toLowerCase() || '';

     const keyHideMap = fields.map((product, i) => {
       const productId = fields.get(i).product;
       const field = productsById[productId][filterKey].toLowerCase();
       return !field.includes(value);
     });

     this.setState( prevState => {
       const hideMap = {...prevState.hideMap};
       hideMap[filterKey] = keyHideMap;
       return {hideMap};
     });
   } catch (e) {
     //
   }
 }

 hideTableRow = (index) => {
   const {hideMap} = this.state;
   let result = false;

   // check if row[index] is hidden by any filter
   for (const key in hideMap) {
     if (hideMap[key][index]) {
       result = true;
       break;
     }
   }
   return result;
 }

 render() {
   const {fields, productsById, meta: {error}, touched, previewMode, children} = this.props;
   let previewIndex = 0;

   const total = <TotalLine><span>{children}</span><span>{this.renderTotal()}</span></TotalLine>;

   return (<>
     {fields.length === 0 && <NoProductTable>В данном контракте нет продуктов</NoProductTable>}
     {fields.length > 0 && <>
     {total}
     <ProductTable condensed responsive>
       <thead>
         {/*  Names */}
         <tr>
           {map( tableHead, (val, key) =>
             <th key={key} style={{minWidth: val.width}}>
               {val.name}
             </th>)}
         </tr>
         {/* Filter */}
         <tr style={{display: previewMode ? 'none' : 'table-row'}}>
           {map( tableHead, (val, key) => {
             if (val.filter) {
               return (
                 <th key={key}>
                   <Field
                     name={key}
                     bsSize='sm'
                     component={Text}
                     placeholder='Фильтр'
                     needClear
                     onChange={this.filterProducts}
                   />
                 </th>);
             } else {
               return <th key={key}></th>;
             }
           })
           }
         </tr>
       </thead>
       <tbody>
         {fields.map((item, i) => {
           let index = i + 1;
           const field = fields.get(i);
           const productId = field.product;

           if (!productId || !productsById[productId]) {
             return null;
           }

           const incorrect = field.incorrect;
           let display = true;

           let rowClass = classNames({
             'warning': incorrect,
             'success': !incorrect && field.quantity > 0,
           });

           if (previewMode) {
             if (field.quantity <= 0 || incorrect) {
               display = false;
             } else {
               previewIndex++;
             }
             index = previewIndex;
             rowClass = null;
           }
           const product = productsById[productId];
           const rowData = {};
           for (const key in tableHead) {
             rowData[key] = field[key] !== undefined ? field[key] : product[key];
           }
           rowData.index = index;
           rowData.show = display && !this.hideTableRow(i);
           rowData.rowName = item;
           rowData.rowClass = rowClass;
           rowData.disabled = incorrect;

           return <ProductRow key={i} {...rowData} />;
         })}
       </tbody>
     </ProductTable>
     {total}
     </>}
     {touched && error && <p className='text-danger'>{error}</p>}
     </>
   );
 }
}

export default ProductFormSection;
