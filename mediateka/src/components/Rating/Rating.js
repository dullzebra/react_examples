import React from 'react';
import withConnect from '_containers/withConnect';

const Rating = ({ contentId, rate, count, userRate, postRate, patchRate }) => {
  const rateRounded = rate ?.toFixed(2);

  const post = rate => {
    if (userRate) {
      patchRate({ id: contentId, rate });
    } else {
      postRate({ id: contentId, rate });
    }
  };
  return (
    <>
      <span className='left rating-active' id='rating-box'>
        {[1, 2, 3, 4, 5].map(value =>
          <i
            key={value}
            className='material-icons tiny vote-btn'
            title={value}
            onClick={post.bind(null, value)}
          >
            {rate < value &&
              <>
                <span className='main'>star_border</span>
                <span className='hover'>star</span>
              </>}
            {rate >= value && 'star'}
          </i>)}

      </span>
      <span>
        {rateRounded} ({count})
      </span>
    </>
  );
};

export default withConnect(Rating, ['postRate', 'patchRate']);
