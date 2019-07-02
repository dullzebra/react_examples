import React from 'react';
import Header from '_components/Header/Header';
import Content from '_components/Content/Content';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Content small>
        {children}
      </Content>
    </>
  );
}

