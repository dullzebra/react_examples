import React from 'react';
import Layout from '_pages/Layout';
import FavCardsLoader from '_containers/FavCardsLoader';
import ContentTypeFilter from '_components/ContentTypeFilter/ContentTypeFilter';


export default function HomePage() {
  return (
    <Layout>
      <ContentTypeFilter />
      <FavCardsLoader />
    </Layout>
  );
}

