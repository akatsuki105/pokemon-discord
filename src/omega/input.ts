type Count = {
  A: number;
  B: number;
  Select: number;
  Start: number;
  Right: number;
  Left: number;
  Up: number;
  Down: number;
  R: number;
  L: number;
};

type Key = keyof Count;

const defaultCount: Count = {
  A: 0,
  B: 0,
  Select: 0,
  Start: 0,
  Right: 0,
  Left: 0,
  Up: 0,
  Down: 0,
  R: 0,
  L: 0,
};

export class Inputs {
  private count: Count;

  constructor() {
    this.count = { ...defaultCount };
  }

  updated = (): boolean => {
    const sum = Object.values(this.count).reduce((prev, curr) => prev + curr, 0);

    return sum > 0;
  };

  set = (k: Key, count: number) => {
    this.count[k] += count;
  };

  toString = (): string => {
    let result = '';
    Object.entries(this.count).forEach(([k, v]) => {
      if (v > 0) {
        switch (k) {
          case 'A':
          case 'B':
          case 'R':
          case 'L':
            result += k;
            break;

          case 'Select':
            result += 'C';
            break;

          case 'Start':
            result += 'D';
            break;

          case 'Right':
            result += '→';
            break;

          case 'Left':
            result += '→';
            break;

          case 'Up':
            result += '↑';
            break;

          case 'Down':
            result += '↓';
            break;
        }
      }
    });

    return result;
  };

  clear = () => {
    this.count = { ...defaultCount };
  };
}
