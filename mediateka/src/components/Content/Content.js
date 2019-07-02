import React from 'react';

export default function Content({ children, small = false }) {
  return (
    <main>
      <div className={'prosvet-container' + (small ? ' small' : '')}>
        <article>
          {children}
        </article>
      </div>
    </main>
  );
}
