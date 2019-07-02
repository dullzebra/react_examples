import React from 'react';
import { Link } from 'react-router-dom';
import Article from '_components/Item/Article';
import Book from '_components/Item/Book';
import Video from '_components/Item/Video';
import Training from '_components/Item/Training';
import Presentation from '_components/Item/Presentation';
import { contentTypes } from '_config/const';
import { path } from '_config/url';

const SpecificContent = React.memo(({ item }) => {
  switch (item.content_type) {
    case contentTypes.V:
      return <Video item={item} />;
    case contentTypes.T:
      return <Training item={item} />;
    case contentTypes.P:
      return <Presentation item={item} />;
    case contentTypes.B:
      return <Book item={item} />;
    case contentTypes.A:
      return <Article item={item} />;
    default:
      return null;
  }
});

export default function Item({ item }) {
  return (
    <>
      <SpecificContent item={item} />
      <div className='container' >
        <section className='section'>
          {[contentTypes.V, contentTypes.A, contentTypes.P].includes(item.content_type) &&
            <h1 className='top-header'>{item.title}</h1>
          }
          <section
            className='block-paragraph'
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        </section>
      </div >

      <div className='container' >
        <section className='section'>

          {item.tags && item.tags.length > 0 &&
            <p><strong>Тэги</strong>:&nbsp;
              {item.tags.map((tag, i) =>
                <Link key={i} className='chip purple lighten-4'
                  to={`${path.SEARCH}?tag=${tag}`}>
                  {tag}
                </Link>)}
            </p>}

          {item.categories && item.categories.length > 0 &&
            <p><strong>Разделы</strong>:&nbsp;
              {item.categories.map((c, i) =>
                <span key={i} className='chip'>{c ?.name}</span>)}
            </p>}

        </section>
        <section className='section'>
          <div id='comments'></div>
        </section>
      </div >
    </>
  );
}
