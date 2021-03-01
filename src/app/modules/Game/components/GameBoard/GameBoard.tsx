import React, { FC }                       from 'react';
import styled                              from 'styled-components';
import { theme }                           from '../../../../../styles';
import { Grid }                            from '@material-ui/core';
import { fieldMap, IBoardChipCoordinates } from '../../utils';
import { Chip }                            from './components/Chip';
import { Field }                           from './components/Field';
import { IChip }                           from '../../models/Chip';
import { Dices }                           from '../Dice';

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

export const GameBoard: FC<IGageBoardProps> = ({ boardState, selectedChip, onChipSelected }) => {
  const chipSelected = (chip: IChip) => !!selectedChip && chip.x === selectedChip.x && chip.y === selectedChip.y;
  
  return (
    <>
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
        
        <Dices/>
      </BoardWrapper>
    </>
  );
};
