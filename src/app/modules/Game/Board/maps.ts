import { ICoordinates, isFieldAccessible } from './boardReducer';

export const lockRooms: ICoordinates<number[]> = {
  1 : {
    1 : [1, 0],
    11: [0, 11]
  },
  11: {
    1 : [12, 1],
    11: [11, 12]
  }
};

export const teleportMap: ICoordinates<{ enter: number[]; exit: number[] }> = {
  0 : {
    1: { exit: [1, 1], enter: [0, 1] },
    3: { exit: [3, 0], enter: [0, 3] },
    4: { exit: [12, 4], enter: [0, 4] },
    8: { exit: [12, 8], enter: [0, 8] },
    9: { exit: [3, 12], enter: [0, 9] }
  },
  1 : {
    12: { exit: [1, 11], enter: [1, 12] }
  },
  3 : {
    0 : { exit: [0, 3], enter: [3, 0] },
    12: { exit: [0, 9], enter: [3, 12] }
  },
  4 : {
    0 : { exit: [4, 12], enter: [4, 0] },
    12: { exit: [4, 0], enter: [4, 12] }
  },
  8 : {
    0 : { exit: [8, 12], enter: [8, 0] },
    12: { exit: [8, 0], enter: [8, 12] }
  },
  9 : {
    0 : { exit: [12, 3], enter: [9, 0] },
    12: { exit: [12, 9], enter: [9, 12] }
  },
  11: {
    0: { exit: [11, 1], enter: [11, 0] }
  },
  12: {
    3 : { exit: [9, 0], enter: [12, 3] },
    4 : { exit: [0, 4], enter: [12, 4] },
    8 : { exit: [0, 8], enter: [12, 8] },
    9 : { exit: [9, 12], enter: [12, 9] },
    11: { exit: [11, 11], enter: [12, 11] }
  }
};

export const figureMargin = (size: number, key: string, id: number) => {
  const shift = `${ size / 4 }px`;
  const center = '0';
  const topLeft = `-${ shift }`;
  const topCenter = `-${ shift } 0`;
  const topRight = `-${ shift } 0 0 ${ shift }`;
  const bottomLeft = `${ shift } 0 0 -${ shift }`;
  const bottomRight = `${ shift }`;

  const map: any = {
    '0'   : { 0: center },
    '1'   : { 1: center },
    '2'   : { 2: center },
    '3'   : { 3: center },
    '01'  : { 0: topLeft, 1: bottomRight },
    '02'  : { 0: topLeft, 2: bottomRight },
    '03'  : { 0: topLeft, 3: bottomRight },
    '12'  : { 1: topLeft, 2: bottomRight },
    '13'  : { 1: topLeft, 3: bottomRight },
    '23'  : { 2: topLeft, 3: bottomRight },
    '012' : { 0: topCenter, 1: bottomLeft, 2: bottomRight },
    '013' : { 0: topCenter, 1: bottomLeft, 3: bottomRight },
    '023' : { 0: topCenter, 2: bottomLeft, 3: bottomRight },
    '123' : { 1: topCenter, 2: bottomLeft, 3: bottomRight },
    '0123': { 0: topRight, 1: topLeft, 2: bottomLeft, 3: bottomRight }
  };

  return map[key] && map[key][id];
};

export const directions = {
  right: 'right',
  down : 'down',
  left : 'left',
  up   : 'up',
};

export const getDirection = (x: number, y: number, teamId: number) => {
  const homeEntrance = ({
    0: {
      6: {
        12: directions.up
      }
    },
    1: {
      0: {
        6: directions.right
      }
    },
    2: {
      6: {
        0: directions.down
      }
    },
    3: {
      12: {
        6: directions.left
      }
    }
  } as any)?.[teamId]?.[x]?.[y];

  const lockRoom = ({
    1 : {
      1 : directions.up,
      11: directions.left
    },
    11: {
      1 : directions.right,
      11: directions.down
    }
  } as any)?.[x]?.[y];

  if (homeEntrance) {
    return homeEntrance;
  } else if (lockRoom) {
    return lockRoom;
  }

  if (y === 0 && x < 12) {
    return directions.right;
  } else if (x === 12 && y < 12) {
    return directions.down;
  } else if (y === 12 && x > 0) {
    return directions.left;
  } else if (x === 0 && y > 0) {
    return directions.up;
  }
};

export const getProjectedPosition = (x: number, y: number, teamId: number, dice = 0) => {
  const direction = getDirection(x, y, teamId);
  const sideLength = 12;
  let canAccess = true;
  let projection;
  let targetX;
  let targetY;

  if (y === 0) {
    const overflow = x + dice > sideLength;
    targetX = overflow ? sideLength : x + dice;
    targetY = overflow ? x + dice - sideLength : 0;

    for (let a = x; a <= targetX; a++) {
      if (!isFieldAccessible(a, y)) {
        canAccess = false;
      }

      if (x === targetX && y !== targetY) {
        for (let b = y; b <= targetY; b++) {
          if (!isFieldAccessible(targetX, b)) {
            canAccess = false;
          }
        }
      }
    }
  } else if (y === sideLength) {
    const overflow = x - dice < 0;
    targetX = overflow ? 0 : x - dice;
    targetY = overflow ? sideLength + (x - dice) : sideLength;

    for (let a = x; a >= targetX; a--) {
      if (!isFieldAccessible(a, y)) {
        canAccess = false;
      }

      if (x === targetX && y !== targetY) {
        for (let b = y; b >= targetY; b--) {
          if (!isFieldAccessible(targetX, b)) {
            canAccess = false;
          }
        }
      }
    }
  } else if (x === 0) {
    const overflow = y - dice < 0;
    targetX = overflow ? dice - y : 0;
    targetY = overflow ? 0 : y - dice;

    for (let a = y; a >= targetY; a--) {
      if (!isFieldAccessible(x, a)) {
        canAccess = false;
      }

      if (x !== targetX && y === targetY) {
        for (let b = y; b <= targetX; b++) {
          if (!isFieldAccessible(targetX, b)) {
            canAccess = false;
          }
        }
      }
    }
  } else if (x === sideLength) {
    const overflow = y + dice > sideLength;
    targetX = overflow ? sideLength - ((y + dice) - sideLength) : sideLength;
    targetY = overflow ? sideLength : y + dice;

    for (let a = y; a <= targetY; a++) {
      if (!isFieldAccessible(x, a)) {
        canAccess = false;
      }

      if (x !== targetX && y === targetY) {
        for (let b = y; b <= targetY; b++) {
          if (!isFieldAccessible(targetX, b)) {
            canAccess = false;
          }
        }
      }
    }
  } else {
    canAccess = false;
  }

  const lockRoomExit = lockRooms[x]?.[y];

  if (canAccess) {
    projection = [targetX, targetY];
  } else if (lockRoomExit && dice === 6) {
    projection = lockRoomExit;
  }

  console.log(direction, dice);
  console.log(canAccess, projection);

  return projection;
};
