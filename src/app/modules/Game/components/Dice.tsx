import React, {FC, useEffect, useState} from "react"
import styled                           from "styled-components";
import { randomNumber }                 from '../../../shared/functions';
import { IconButton }                   from '@material-ui/core';

export const rollDices = () => {
  const dices: any = document.getElementsByClassName('dice');
  const min = 1;
  const max = 16;
  
  const randomAngle = (max: number, min: number) => {
    return randomNumber(min, max) * 90;
  }
  
  if (dices && dices.length) {
    Array.prototype.forEach.call(dices, (dice) => {
      const randA = randomNumber(1, 6);
      const randB = randomNumber(1, 6);
      
      let xRand = randomAngle(max, min);
      let yRand = randomAngle(max, min);
      
      dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      
      return [randA, randB];
    })
  }
}

export const Dices: FC = () => {
  const [size, setSize] = useState(85);

  const handleSizeCheck = () => {
    const el: any = document.getElementsByClassName('field')[0];
    setSize(el && el.offsetHeight);
  }

  useEffect(() => {
    window.addEventListener('resize', () => handleSizeCheck());

    return () => {
      window.removeEventListener('resize', () => handleSizeCheck());
    };
  }, [window.innerWidth]);

  const DicesLayer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: ${size * 2.5}px;
    height: ${size * 2.5}px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
  `;

  const DiceWrapper = styled.div`&& {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    /* Resolve distortion */
    transition: transform 1s;
    transform: scale(0.9);
  }`;

  /* Effect */
  const DiceFace = styled.div`&& {
    position: absolute;
    background: rgba(255,255,255, 0.95);
    width: ${size}px;
    height: ${size}px;
    padding: ${size / 10}px;
    border-radius: ${size / 4}px;
    display: flex;
    box-shadow: 0px 10px 35px -15px rgba(255,255,255,0.8);
  }`;

  /* TranslateZ = (face's width / 2) */

  /* Face 1 */
  const DiceFaceFront = styled(DiceFace)`&& {
    transform: rotateY(0) translateZ(${size / 2}px);
  }`;

  const DiceFaceBack = styled(DiceFace)`&& {
    transform: rotateY(180deg) translateZ(${size / 2}px);
    display: grid;
    grid-template-columns: 1fr 1fr;
  }`;

  const DiceFaceTop = styled(DiceFace)`&& {
    transform: rotateX(90deg) translateZ(${size / 2}px);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }`;

  const DiceFaceBottom = styled(DiceFace)`&& {
    transform: rotateX(-90deg) translateZ(${size / 2}px);
  }`;

  const DiceFaceLeft = styled(DiceFace)`&& {
    transform: rotateY(-90deg) translateZ(${size / 2}px);
    display: grid;
  }`;

  const DiceFaceRight = styled(DiceFace)`&& {
    transform: rotateY(90deg) translateZ(${size / 2}px);
    display: grid;
    grid-template-columns: 1fr 1fr;
}`;

  const Dot = styled.div`&& {
    background: black;
    width: ${size / 5}px;
    height: ${size / 5}px;
    border-radius: 50%;
    margin: auto auto;
  }`;

  const Dot1 = styled(Dot)`&& {
    background: red;
  }`;

  const Dot5m = styled(Dot)`&& {
    grid-column: 2;
    grid-row: 2;
  }`;

  const Dot5t1 = styled(Dot)`&& {
    grid-column: 1;
    grid-row: 1;
  }`;

  const Dot5t2 = styled(Dot)`&& {
    grid-column: 1;
    grid-row: 3;
  }`;

  const Dot5b1 = styled(Dot)`&& {
    grid-column: 3;
    grid-row: 1;
  }`;

  const Dot5b2 = styled(Dot)`&& {
    grid-column: 3;
    grid-row: 3;
  }`;

  const DotUp = styled(Dot)`&& {
    margin-top: 0;
  }`;

  const DotDown = styled(Dot)`&& {
    margin-bottom: 0;
  }`;
  
  const DotLeft = styled(Dot)`&& {
    margin-left: 0;
  }`;
  
  const DotRight = styled(Dot)`&& {
    margin-right: 0;
  }`;

  const Dice = () => (
    <DiceWrapper className="dice">
      <DiceFaceFront>
        <Dot1/>
      </DiceFaceFront>
      <DiceFaceBack>
        <Dot/>
        <Dot/>
        <Dot/>
        <Dot/>
        <Dot/>
        <Dot/>
      </DiceFaceBack>
      <DiceFaceLeft>
        <DotLeft/>
        <Dot/>
        <DotRight/>
      </DiceFaceLeft>
      <DiceFaceRight>
        <Dot/>
        <Dot/>
        <Dot/>
        <Dot/>
      </DiceFaceRight>
      <DiceFaceTop>
        <Dot5t1/>
        <Dot5t2/>
        <Dot5m/>
        <Dot5b1/>
        <Dot5b2/>
      </DiceFaceTop>
      <DiceFaceBottom>
        <DotUp/>
        <DotDown/>
      </DiceFaceBottom>
    </DiceWrapper>
  )

  return (
    <DicesLayer onClick={ rollDices }>
      <Dice/>
      <Dice/>
    </DicesLayer>
  )
}
