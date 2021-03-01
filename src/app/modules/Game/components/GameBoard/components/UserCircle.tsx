import { IconButton }  from '@material-ui/core';
import React, { FC }   from 'react';
import styled, { css } from 'styled-components';

export const UserImageWrapper = styled.div`
  ${({color, theme: {breakpoints}}: any) => css`
    width: 38px;
    height: 38px;
    min-width: 38px;
    border: 2px solid ${color};
    background-color: ${color};
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    &:last-child {
      margin-right: 0;
    }
    
    ${breakpoints.up('md')} {
      width: 44px;
      height: 44px;
    }
    
    button {
      width: 100%;
      height: 100%;
      padding: 0;
      font-size: 14px;
      font-weight: 600;
      position: relative;
      
      img {
        height: 100%;
        position: absolute;
      }
    }
`}`;

interface IUserCircle {
  color?: string;
  image?: string;
  initials?: string;
}

export const UserCircle: FC<IUserCircle> = ({
  color = '#6f90d9',
  image,
  initials
}) => (
  <UserImageWrapper color={color}>
    <IconButton
      color="inherit"
      onClick={() => true}
    >
      {image ? (
        <img src={image} alt={initials}/>
      ) : (
        <span>{initials}</span>
      )}
    </IconButton>
  </UserImageWrapper>
);
