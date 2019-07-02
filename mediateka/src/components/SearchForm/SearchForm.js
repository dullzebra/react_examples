import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import { path } from '_config/url';

const SearchForm = props => {
  const search = qs.parse(props.location.search.replace('?', ''));
  const title = search.title || '';

  const [value, setValue] = useState(title);

  function onSubmit(e) {
    e.preventDefault();
    props.history.push(path.SEARCH + '?title=' + value);
  }

  return (
    <form action='/' onSubmit={onSubmit}>
      <div className='input-field'>
        <input
          id='search'
          type='search'
          className='purple darken-3 white-text'
          placeholder='введите строку поиска'
          name='title'
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <label
          className='label-icon'
          htmlFor='search'
        >
          <i className='material-icons white-text'>search</i>
        </label>
      </div>
    </form>
  );
};


export default withRouter(SearchForm);
