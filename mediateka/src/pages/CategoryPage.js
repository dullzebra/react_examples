import React from 'react';
import Layout from '_pages/Layout';
import CategoryCardsLoader from '_containers/CategoryCardsLoader';
import ContentTypeFilter from '_components/ContentTypeFilter/ContentTypeFilter';

export default function CategoryPage() {
  return (
    <Layout>
      <ContentTypeFilter />
      <CategoryCardsLoader />
    </Layout>
  );
}

