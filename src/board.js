const BLOCK_STATE_INITIAL = Symbol("BLOCK_STATE_INITIAL");

class Block {
  constructor({ state = BLOCK_STATE_INITIAL, color = 'red' } = {}) {
    this.state = state;
    this.color = color;
  }
}

class BoardGrid {

  constructor(width, height) {
    this.width = width;
    this.heigh = height;

    this.grid = Array(height);
    for (let col = 0; col < height; ++col) {
      this.grid[col] = Array(width);
    }
  }

  get(x, y) { return this.grid[x][y]; }
  put(x, y, new_state) { this.grid[x][y] = new_state; }
};

class Board {
  constructor({ width = 8, height = 20 } = {}) {
    this.width = width;
    this.height = height;
    this.grid = new BoardGrid(width, height);

    this.grid.put(2, 1, new Block());
    this.grid.put(3, 1, new Block({ color: 'purple' }));
    this.grid.put(4, 1, new Block({ color: 'red' }));
    this.grid.put(5, 1, new Block({ color: 'green' }));
    this.grid.put(7, 1, new Block({ color: 'red' }));

    this.grid.put(7, 2, new Block({ color: 'purple' }));
    this.grid.put(2, 2, new Block({ color: 'green' }));

    this.grid.put(4, 3, new Block({ color: 'purple' }));
    this.grid.put(6, 3, new Block({ color: 'green' }));
    this.grid.put(9, 3, new Block({ color: 'red' }));
  }

  requestSwap(positionOne, positionTwo) {
    const blockOne = this.grid.get(...positionOne);
    const blockTwo = this.grid.get(...positionTwo);
    this.grid.put(...positionTwo, blockOne);
    this.grid.put(...positionOne, blockTwo);
  }

  _determineClears() {
    let allClears = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const block = this.grid.get(x, y);
        if (block) {
          let rowClears = this._getLineClears(x, y, block.color, true);
          let colClears = this._getLineClears(x, y, block.color, false);
          allClears.push(...rowClears);
          allClears.push(...colClears);
        }
      }
    }
    allClears.forEach((xy) => this.grid.put(...xy, null));
  }

  _getLineClears(x, y, color, isRow) {
    let clears = [];
    let next;
    do {
      clears.push([x, y]);
      if (isRow) {
        x++
      } else {
        y++;
      }
      next = this.grid.get(x, y);
    } while (next && next.color == color);
    return clears.length >= 3 ? clears : [];
  }

  tick() {
    this._determineClears();
  }
}

export { Board };