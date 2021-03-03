import { Chip, IChip } from './Chip';
import { arrayOfType } from '../../../shared/functions';

export interface IPlayer {
  id: string;
  active: boolean;
  name: string;
  color: string;
  chips: IChip[];
}

export class Player implements IPlayer {
  id: string = ''
  active: boolean = false;
  name: string = '';
  color: string = '';
  chips: IChip[] = [];

  constructor(data: IPlayer) {
    if (data) {
      this.id = data.id;
      this.active = data.active;
      this.name = data.name;
      this.color = data.color;
      this.chips = arrayOfType(data.chips, Chip);
    }
  }
}
