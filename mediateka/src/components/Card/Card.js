import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import CradBadge from './CardBadge';
import Favorite from '_components/Favorite/Favorite';
import { path } from '_config/url';

dayjs.locale('ru');
dayjs.extend(relativeTime);

export default function Card({ card }) {
  const rateRounded = card.rate ?.toFixed(2);
  return (
    <div className='card prosvet-card small'>
      <div className='card-image'>
        <CradBadge type={card.content_type} />
        <Link to={`${path[card.content_type]}${card.id}/`}><img src={card.logo_mini} /></Link>
      </div>
      <div className='card-content'>
        <div>
          <Link to={`${path[card.content_type]}${card.id}/`} className='card-title truncate'>
            <strong>{card.title}</strong>
          </Link>
        </div>
        {card.owner_object &&
          <div>
            <strong className='grey-text text-darken-2'>{card.owner_object.first_name}</strong>
          </div>}

        <div className='date'>{dayjs(card.modified).fromNow()}</div>
        <div className='left views grey-text text-darken-2'>
          <i className='material-icons tiny' title='Количество просмотров'>visibility</i>
          {card.view_count}
        </div>

        {card.rate_count > 0 &&
          <div className='left rate grey-text text-darken-2'>
            <span className='spacer grey-text text-darken-4'></span>
            <i className='material-icons tiny' title='Рейтинг пользователей'>star</i>
            {rateRounded} ({card.rate_count})
          </div>
        }

        <div className='right'>
          <Favorite
            isFavorite={card.user_favorite}
            contentId={card.id}
          />
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content_type: PropTypes.string.isRequired,
    logo_mini: PropTypes.string,
    title: PropTypes.string.isRequired,
    owner_object: PropTypes.object,
    modified: PropTypes.string.isRequired,
    view_count: PropTypes.number.isRequired,
    rate_count: PropTypes.number.isRequired,
    user_favorite: PropTypes.bool,
  }),
};
