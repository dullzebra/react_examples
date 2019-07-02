import React from 'react';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import { qsType } from '_utils';

const ContentTypeFilter = props => {
  let search = props.location.search;
  const searchObj = qs.parse(search.replace('?', ''));
  const pathname = props.location.pathname;

  const type = qsType(search);

  function toggleTypeFilter(T) {
    const copy = [...type];
    const ind = copy.indexOf(T);

    if (ind > -1) {
      copy.splice(ind, 1);
    } else {
      copy.push(T);
    }

    searchObj.type = copy;
    search = qs.stringify(searchObj, { arrayFormat: 'repeat' });
    props.history.push(pathname + '?' + search);
  }


  return (
    <p className='page-filter'>
      <span
        className={'chip ' + (type.includes('V') ? 'purple darken-4 white-text' : 'grey lighten-1')}
        onClick={toggleTypeFilter.bind(null, 'V')}
      >
        Видео</span>
      <span
        className={'chip ' + (type.includes('A') ? 'purple darken-4 white-text' : 'grey lighten-1')}
        onClick={toggleTypeFilter.bind(null, 'A')}
      >
        Статья</span>
      <span
        className={'chip ' + (type.includes('P') ? 'purple darken-4 white-text' : 'grey lighten-1')}
        onClick={toggleTypeFilter.bind(null, 'P')}
      >
        Урок</span>
      <span
        className={'chip ' + (type.includes('T') ? 'purple darken-4 white-text' : 'grey lighten-1')}
        onClick={toggleTypeFilter.bind(null, 'T')}
      >
        Тренажер</span>
      <span
        className={'chip ' + (type.includes('B') ? 'purple darken-4 white-text' : 'grey lighten-1')}
        onClick={toggleTypeFilter.bind(null, 'B')}
      >
        Учебник</span>
    </p>
  );
};

export default withRouter(ContentTypeFilter);

