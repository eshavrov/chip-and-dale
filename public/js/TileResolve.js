export default class TileResolve {
    constructor(matrix, tileSize = 16) {
        this.matrix = matrix;
        this.tileSize = tileSize;
    }

    toIndex(position) {
        return Math.floor(position / this.tileSize)
    }
    toIndexRange(pos1, pos2) {
        const pMax = Math.ceil(pos2/this.tileSize) * this.tileSize
        const range = [];
        let pos = pos1;
        do {
            range.push(this.toIndex(pos));
            pos += this.tileSize;
        } while (pos < pMax);
        return range;
    }

    getByIndex(indexX, indexY) {
        const tile = this.matrix.get(indexX, indexY);
        
        if (tile) {
            const top = indexY * this.tileSize;
            const bottom = top + this.tileSize;
            const left = indexX * this.tileSize;
            const right = left + this.tileSize;
            return {
                tile,
                top, bottom,
                left, right
            }
        }
        return false;
    }

    searchByPosition(posX, posY) {
        return this.getByIndex(
            this.toIndex(posX),
            this.toIndex(posY)
        );
    }

    searchByRange(x1, x2, y1, y2) {
        const matches = [];
        this.toIndexRange(x1, x2).forEach(indexX => {
            this.toIndexRange(y1, y2).forEach(indexY => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });

        return matches;    
    }
}

