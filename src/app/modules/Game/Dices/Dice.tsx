import React, { FC, useMemo } from 'react';
import styled, { css }        from 'styled-components';
import { ISizeProp }          from './Dices';

const DiceWrapper = styled.div`${ css`
  width: 100%;
  height: 100%;
  padding: 5px;
  position: relative;
  transform-style: preserve-3d;
  /* Resolve distortion */
  transition: transform 1s;
  transform: scale(0.9);
` }`;

/* Effect */
const DiceFace = styled.div<ISizeProp>`${ ({ size }) => css`&& {
  position: absolute;
  background: rgba(255,255,255, 0.95);
  width: ${ size }px;
  height: ${ size }px;
  padding: ${ size / 10 }px;
  border-radius: ${ size / 4 }px;
  display: flex;
  box-shadow: 0px 10px 35px -15px rgba(255,255,255,0.8);
}` }`;

/* TranslateZ = (face's width / 2) */

/* Face 1 */
const DiceFaceFront = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateY(0) translateZ(${ size / 2 }px);
}` }`;

const DiceFaceBack = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateY(180deg) translateZ(${ size / 2 }px);
  display: grid;
  grid-template-columns: 1fr 1fr;
}` }`;

const DiceFaceTop = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateX(90deg) translateZ(${ size / 2 }px);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}` }`;

const DiceFaceBottom = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateX(-90deg) translateZ(${ size / 2 }px);
}` }`;

const DiceFaceLeft = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateY(-90deg) translateZ(${ size / 2 }px);
  display: grid;
}` }`;

const DiceFaceRight = styled(DiceFace)<ISizeProp>`${ ({ size }) => css`&& {
  transform: rotateY(90deg) translateZ(${ size / 2 }px);
  display: grid;
  grid-template-columns: 1fr 1fr;
}` }`;

const Dot = styled.div<ISizeProp>`${ ({ size }) => css`&& {
  background: black;
  width: ${ size / 5 }px;
  height: ${ size / 5 }px;
  border-radius: 50%;
  margin: auto auto;
}` }`;

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
  margin-top: 8px;
}`;

const DotDown = styled(Dot)`&& {
  margin-bottom: 8px;
}`;

const DotLeft = styled(Dot)`&& {
  margin-left: 0;
}`;

const DotRight = styled(Dot)`&& {
  margin-right: 0;
}`;

export const Dice: FC<ISizeProp> = ({ size }) => {
  return useMemo(() => (
    <DiceWrapper className="dice">
      <DiceFaceFront size={ size }>
        <Dot1 size={ size }/>
      </DiceFaceFront>
      <DiceFaceBack size={ size }>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
      </DiceFaceBack>
      <DiceFaceLeft size={ size }>
        <DotLeft size={ size }/>
        <Dot size={ size }/>
        <DotRight size={ size }/>
      </DiceFaceLeft>
      <DiceFaceRight size={ size }>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
        <Dot size={ size }/>
      </DiceFaceRight>
      <DiceFaceTop size={ size }>
        <Dot5t1 size={ size }/>
        <Dot5t2 size={ size }/>
        <Dot5m size={ size }/>
        <Dot5b1 size={ size }/>
        <Dot5b2 size={ size }/>
      </DiceFaceTop>
      <DiceFaceBottom size={ size }>
        <DotUp size={ size }/>
        <DotDown size={ size }/>
      </DiceFaceBottom>
    </DiceWrapper>
  ), [size]);
};
