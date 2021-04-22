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

const bounce = keyframes`
  0% {
      transform: scale(1.7);
  }
  20% {
      transform: scale(1.5);
  }
  100% {
      transform: scale(1);
  }
`;

const DicesLayer = styled.div<ISizeProp & { active: boolean }>`${ ({ size, active }) => css`
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
  z-index: 1;
  transform-style: preserve-3d;
  transition: ease 1s transform;
  
  ${ active && css`
    animation: ${ bounce } 1s linear;
  `}
`}`;

interface IDicesProps {
  size: number;
}

export const Dices: FC<IDicesProps> = ({ size }) => {
  const [active, setActive] = useState(false);
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
      const angle = randomNumber(-4, 4) * 90;
      dicesWrapper.style.transform = 'rotate(' + angle + 'deg)';

      setActive(true);

      setTimeout(() => {
        setActive(false);
      }, 500);
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
      active={active}
      size={ size }
      onClick={ onClick }
    >
      <Dice size={ size }/>
      <Dice size={ size }/>
    </DicesLayer>
  );
};
