import TileResolve from './TileResolve.js'
import { Sides } from './Entity.js';

export default class TileCollider {
    constructor(tileMatrix) {
        this.tiles = new TileResolve(tileMatrix);
    }

    checkY(entity) {
        let y;
        if (entity._velocity.y > 0) {
            y = entity._position.y + entity.size.y;
        } else if (entity._velocity.y < 0) {
            y = entity._position.y;
        } else return;
        const matches = this.tiles.searchByRange(
            entity._position.x,
            entity._position.x + entity.size.x,
            y, y
        );
        matches.forEach(match => {


            if (match.tile.type !== 'static' && match.tile.type !== 'top' ) {
                return;
            }

            if (entity._velocity.y > 0) {
                if (entity._position.y + entity.size.y > match.top) {
                    entity._position.y = match.top - entity.size.y;
                    entity._velocity.y = 0;

                    entity.obstruct(Sides.BOTTOM);
                }
            } else if (entity._velocity.y < 0) {
                if (match.tile.type === 'top') {
                    return;
                }
                if (entity._position.y < match.bottom) {
                    entity._position.y = match.bottom;
                    entity._velocity.y = 0;
                   entity.obstruct(Sides.TOP);

                }
            }
        });
    }

    checkX(entity) {
        let x;
        if (entity._velocity.x > 0) {
            x = entity._position.x + entity.size.x;
        } else if (entity._velocity.x < 0) {
            x = entity._position.x;
        } else return;
        const matches = this.tiles.searchByRange(
            x, x,
            entity._position.y,
            entity._position.y + entity.size.y
        );
        matches.slice().reverse().forEach(match => {


            if (match.tile.type !== 'static') {
                return;
            }

            if (entity._velocity.x > 0) {
                if (entity._position.x + entity.size.x > match.left) {
                    entity._position.x = match.left - entity.size.x;
                    entity._velocity.x = 0;
                }
            } else if (entity._velocity.x < 0) {
                if (entity._position.x < match.right) {
                    entity._position.x = match.right;
                    entity._velocity.x = 0;
                }
            }
        });
    }

    test(entity) {
        this.checkY(entity);
        this.checkX(entity);



    }
}