import React from 'react';
import Card from '_components/Card/Card';

export default function CardList({ title, list, oneRow = false }) {
  return (
    <section>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <div className={'row' + (oneRow ? ' row-one-card' : '')}>
        {list.length > 0 && list.map(card => (
          <div className='col' key={card.id}>
            <Card card={card} />
          </div>
        ))}
      </div>
    </section >
  );
}

