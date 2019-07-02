import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const palette = [
  '#607D8B',
  '#EF5350',
  '#BA68C8',
  '#448AFF',
  '#0097A7',
  '#A1887F',
  '#827717',
];

const AvatarStyled = styled.div`
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  line-height: ${props => props.size}px;
  font-size: ${props => props.size / 2.7}px;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
  color: #fff;
  background-color: ${props => props.bg};
`;

export const getColor = (string) => {
  try {
    const index = string.length % palette.length;
    return palette[index];
  } catch (err) {
    return palette[0];
  }
};

const getInitials = (string) => {
  let result = ':(';
  try {
    let arr = string.split(' ').slice(0, 2);
    arr = arr.map(w => w.charAt(0));
    result = arr.join('');
  } catch (e) {
    //console.log(e);
  }
  return result;
};

const Avatar = ({name = '', size = 50 }) => (
  <AvatarStyled size={size} bg={getColor(name)}>
    {getInitials(name)}
  </AvatarStyled>
);

export default Avatar;
