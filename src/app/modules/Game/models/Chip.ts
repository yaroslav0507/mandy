export interface IChip {
  x: number;
  y: number;
  inHouse?: boolean;
}

export class Chip implements IChip {
  x: number = 0;
  y: number = 0;
  inHouse?: boolean = false;
  
  constructor(data: IChip) {
    if (data) {
      this.x = data.x;
      this.y = data.y;
      this.inHouse = data.inHouse;
    }
  }
}
