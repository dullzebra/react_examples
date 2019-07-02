import React from 'react';
import Layout from '_pages/Layout';
import OwnerCardsLoader from '_containers/OwnerCardsLoader';
import ContentTypeFilter from '_components/ContentTypeFilter/ContentTypeFilter';

export default function HomePage() {
  return (
    <Layout>
      <ContentTypeFilter />
      <OwnerCardsLoader />
    </Layout>
  );
}

