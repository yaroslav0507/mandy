import React, { FC, useState }             from 'react';
import styled                              from 'styled-components';
import { theme }                           from '../../../../../styles';
import { Grid }                            from '@material-ui/core';
import { fieldMap, IBoardChipCoordinates } from '../../utils';
import { Chip }                            from './components/Chip';
import { Field }                           from './components/Field';
import { IChip }                           from '../../models/Chip';
import { Dices }                           from '../Dice';
import { randomNumber }                    from '../../../../shared/functions';

const BoardWrapper = styled(Grid)`&& {
  width: 100%;
  position: relative;
  max-width: calc(100vh - 110px);
  background: #262933;
}`;

const Board = styled.div`
  font-size: 16px;
  color: ${ theme.colors.info };
  width: 100%;
  height: 100%;
  display: flex;
  
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const Row = styled.div`
  width: ${ 100 / 13 }%;
`;

interface IGageBoardProps {
  boardState: IBoardChipCoordinates;
  selectedChip?: IChip;
  onChipSelected: (x: number, y: number) => void;
}

export const rollDices = (config?: number[][]) => {
  const result: number[][] = [];
  const dices: any = document.getElementsByClassName('dice');
  const min = 1;
  const max = 16;
  
  const randomAngle = (max: number, min: number) => {
    return randomNumber(min, max) * 90;
  }
  
  if (dices && dices.length) {
    Array.prototype.forEach.call(dices, (dice, index) => {
      const conf = config && config[index];
      const xRand = conf ? conf[0] : randomAngle(max, min);
      const yRand = conf ? conf[1] : randomAngle(max, min);
      
      dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      dice.style.transform = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
      
      result.push([xRand, yRand]);
    })
  }
  
  return result;
}

const angleToResult = (xAngle: number, yAngle: number) => {
  const spinMap = {
    0: {
      0: 1,
      1: 3,
      2: 6,
      3: 4
    },
    1: {
      0: 2,
      1: 2,
      2: 2,
      3: 2
    },
    2: {
      0: 6,
      1: 4,
      2: 1,
      3: 3
    },
    3: {
      0: 5,
      1: 5,
      2: 5,
      3: 5
    }
  };
  
  const spins = (degX: number, degY: number) => ({ a: (degX / 90) % 4, b: (degY / 90) % 4});
  const {a, b} = spins(xAngle, yAngle);
  // @ts-ignore
  return spinMap[a][b]
}

export const GameBoard: FC<IGageBoardProps> = ({ boardState, selectedChip, onChipSelected }) => {
  const chipSelected = (chip: IChip) => !!selectedChip && chip.x === selectedChip.x && chip.y === selectedChip.y;
  const [dices, setDices] = useState<number[][]>([]);
  
  const rollTheDice = () => {
    const result = rollDices();
    setDices(result);
    
    console.log(result);
    console.log(angleToResult(result[0][0], result[0][1]));
    console.log(angleToResult(result[1][0], result[1][1]));
  }
  
  return (
    <BoardWrapper item>
      <Board>
        { fieldMap.map((row, x) => (
          <Row key={ x }>
            { row.map((field, y) => {
              const player = boardState[x] ? boardState[x][y] : null;
            
              return (
                <Field
                  key={ y }
                  className="field"
                  empty={ !field }
                  selected={ chipSelected({ x, y }) }
                  withChip={ !!player }
                  onClick={ () => player && onChipSelected(x, y) }
                >
                  { player ? (
                    <Chip color={ player.color }/>
                  ) : null }
                </Field>
              )
            }) }
          </Row>
        )) }
      </Board>
    
      <Dices
        angles={dices}
        onClick={() => rollTheDice()}
      />
    </BoardWrapper>
  );
};
