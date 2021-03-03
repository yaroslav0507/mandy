import React, { FC, useEffect, useState } from "react"
import styled, { css }                    from "styled-components";
import { useSelector }                    from "react-redux";
import { useAppDispatch }                 from '../../../hooks';
import { randomize, selectDicesAngles }   from './dicesReducer';
import { Dice }                           from './Dice';

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

export const Dices: FC = () => {
  const angles = useSelector(selectDicesAngles);
  const [size, setSize] = useState(85);
  const dispatch = useAppDispatch();

  const handleSizeCheck = () => {
    const el: any = document.getElementsByClassName('field')[0];
    setSize(el && el.offsetHeight);
  }

  const setDicesToResultValues = () => {
    const dices: any = document.getElementsByClassName('dice');
    if (dices && dices.length) {
      Array.prototype.forEach.call(dices, (dice, index) => {
        const [xRand, yRand] = angles[index];
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
        dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      })
    }
  }

  useEffect(() => {
    handleSizeCheck();
  }, []);

  useEffect(() => {
    setTimeout(() => setDicesToResultValues());
  }, [angles]);

  useEffect(() => {
    window.addEventListener('resize', () => handleSizeCheck());

    return () => {
      window.removeEventListener('resize', () => handleSizeCheck());
    };
  }, [size, window.innerWidth]);

  return (
    <DicesLayer
      size={ size }
      onClick={ () => dispatch(randomize()) }
    >
      <Dice size={ size }/>
      <Dice size={ size }/>
    </DicesLayer>
  )
}
