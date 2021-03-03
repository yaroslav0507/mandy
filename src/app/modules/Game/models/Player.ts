import { Chip, IChip } from './Chip';
import { arrayOfType } from '../../../shared/functions';

export interface IPlayer {
  name: string;
  color: string;
  chips: IChip[];
}

export class Player implements IPlayer {
  name: string = '';
  color: string = '';
  chips: IChip[] = [];

  constructor(data: IPlayer) {
    if (data) {
      this.name = data.name;
      this.color = data.color;
      this.chips = arrayOfType(data.chips, Chip);
    }
  }
}
