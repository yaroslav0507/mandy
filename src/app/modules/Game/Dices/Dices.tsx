import React, { FC, useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes }                  from 'styled-components';
import { useSelector }            from 'react-redux';
import { useAppDispatch }                                  from '../../../hooks';
import { randomize, selectDicesAngles, selectDicesPlayed } from './dicesReducer';
import { Dice }                                            from './Dice';
import { randomNumber }                 from '../../../shared/functions';

export interface ISizeProp {
  size: number;
}

const DicesLayer = styled.div<ISizeProp>`${ ({ size }) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${ size * 2.5 }px;
  height: ${ size * 2.5 }px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
  z-index: 2;
  transform-style: preserve-3d;
  transition: ease 1s transform;
`}`;

interface IDicesProps {
  size: number;
}

export const Dices: FC<IDicesProps> = ({ size }) => {
  const angles = useSelector(selectDicesAngles);
  const dicesPlayed = useSelector(selectDicesPlayed);
  const dispatch = useAppDispatch();

  const setDicesToResultValues = () => {
    const dices: HTMLCollectionOf<Element> = document.getElementsByClassName('dice');
    const dicesWrapper: HTMLElement | null = document.getElementById('dices');

    if (dices && dices.length) {
      Array.prototype.forEach.call(dices, (dice, index) => {
        const [xRand, yRand] = angles[index];
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      });
    }

    if (dicesWrapper && dicesPlayed) {
      const angle = randomNumber(0, 15) * 90;
      const rotationStyle = `rotate(${angle}deg)`;

      dicesWrapper.style.transition = 'ease 1s transform';
      dicesWrapper.style.filter = 'blur(.5px)';
      dicesWrapper.style.transform = `${rotationStyle} scale(2)`;

      setTimeout(() => {
        dicesWrapper.style.transition = 'ease .5s all';
        dicesWrapper.style.filter = 'none';
      }, 400);

      setTimeout(() => {
        dicesWrapper.style.transform = `${rotationStyle}`;
      }, 800);
    }
  };

  useEffect(() => {
    setTimeout(() => setDicesToResultValues());
  }, [angles]);

  const onClick = () => {
    dispatch(randomize());
  };

  return (
    <DicesLayer
      id="dices"
      size={ size }
      onClick={ onClick }
    >
      <Dice size={ size }/>
      <Dice size={ size }/>
    </DicesLayer>
  );
};
