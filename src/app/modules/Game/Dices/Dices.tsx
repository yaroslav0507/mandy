import React, { FC, useEffect }         from 'react';
import styled, { css }                  from 'styled-components';
import { useSelector }                  from 'react-redux';
import { useAppDispatch }               from '../../../hooks';
import { randomize, selectDicesAngles } from './dicesReducer';
import { Dice }                         from './Dice';

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
` }`;

interface IDicesProps {
  size: number;
}

export const Dices: FC<IDicesProps> = ({ size }) => {
  const angles = useSelector(selectDicesAngles);
  const dispatch = useAppDispatch();

  const setDicesToResultValues = () => {
    const dices: HTMLCollectionOf<Element> = document.getElementsByClassName('dice');
    if (dices && dices.length) {
      Array.prototype.forEach.call(dices, (dice, index) => {
        const [xRand, yRand] = angles[index];
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      });
    }
  };

  useEffect(() => {
    setTimeout(() => setDicesToResultValues());
  }, [angles]);

  return (
    <DicesLayer
      size={ size }
      onClick={ () => dispatch(randomize()) }
    >
      <Dice size={ size }/>
      <Dice size={ size }/>
    </DicesLayer>
  );
};
