import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/lib/Pagination';

const PagerRange = React.memo(({start, end, current, onClick}) => {
  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === current}
        onClick={onClick?.bind(null, i)}
      >{i}
      </Pagination.Item>
    );
  }

  return pages;
});


const Pager = React.memo(({pageTotal, current, onClick}) => {
  if (pageTotal <= 10) {
    return (
      <Pagination bsSize='small'>
        <PagerRange
          start={1}
          end={pageTotal}
          current={current}
          onClick={onClick}
        />
      </Pagination>);
  } else {
    // how many pages in list
    const range = 7;
    // how many pages before the middle of the list
    const aside = (range - 1) / 2;
    let start = 1;

    const beforeRange = [
      <Pagination.Prev key={0}
        title='На предыдущую'
        onClick={() => {
          current > 1 && onClick?.(current - 1);
        }}
      />,
    ];

    const afterRange = [
      <Pagination.Next key={0}
        title='На следующую'
        onClick={() => {
          current < pageTotal && onClick?.(current + 1);
        }}
      />,
    ];

    // first page link
    if (current > aside + 1) {
      start = current - aside;
      beforeRange.push(
        <Pagination.Item key={1}
          onClick={onClick?.bind(null, 1)}
        >
          {1}
        </Pagination.Item>
      );
    }

    // last
    if (current > pageTotal - aside) {
      start = pageTotal - range + 1;
    } else if (start + range <= pageTotal ) {
      // last page link
      afterRange.push(
        <Pagination.Item key={1}
          onClick={onClick?.bind(null, pageTotal)}
        >
          {pageTotal}
        </Pagination.Item>
      );
    }

    // prev '...'
    if (start > 2) {
      let goto = current - range >= 1 ? current - range : 1;
      const fromEnd = pageTotal - current;

      if (fromEnd < aside) {
        goto -= aside - fromEnd;
      }
      beforeRange.push(
        <Pagination.Ellipsis key={2}
          onClick={onClick?.bind(null, goto)}
        />
      );
    }

    // next '...'
    if (start + range < pageTotal) {
      let goto = current + range <= pageTotal ? current + range : pageTotal;
      const fromStart = current - 1;

      if (fromStart < aside ) {
        goto += aside - fromStart;
      }
      afterRange.push(
        <Pagination.Ellipsis key={2}
          onClick={onClick?.bind(null, goto)}
        />
      );
    }

    return (
      <Pagination bsSize='small'>
        {beforeRange}
        <PagerRange
          start={start}
          end={start + range - 1}
          current={current}
          onClick={onClick}
        />
        {afterRange.reverse()}
      </Pagination>);
  }
});

export default Pager;

Pager.propTypes = {
  current: PropTypes.number,
  pageTotal: PropTypes.number,
  onClick: PropTypes.func,
};
