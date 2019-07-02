import React from 'react';
import Header from '_components/Header/Header';
import Aside from '_components/Aside/Aside';
import Content from '_components/Content/Content';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Aside />
      <Content>
        {children}
      </Content>
    </>
  );
}

