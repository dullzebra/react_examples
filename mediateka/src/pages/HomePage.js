import React from 'react';
import Layout from '_pages/Layout';
import LastCardsLoader from '_containers/LastCardsLoader';
import RecommendCardsLoader from '_containers/RecommendCardsLoader';
import ContentTypeFilter from '_components/ContentTypeFilter/ContentTypeFilter';


export default function HomePage() {
  return (
    <Layout>
      <ContentTypeFilter />
      <RecommendCardsLoader />
      <LastCardsLoader />
    </Layout>
  );
}

