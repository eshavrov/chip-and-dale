import Compositor from './Compositor.js';
import {Matrix} from './math.js';
import TileCollider from './TileCollider.js';

export default class Level {
    constructor(){
        this.gravity = 1200;
        this.totalTime = 0;
        this.compositor = new Compositor();
        this.entities = new Set();
        // this.tiles = new Matrix();

        // this.tileCollider = new TileCollider(this.tiles);
        this.tileCollider = null;
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    update(deltaTime) {
        this.entities.forEach(entity => {
            entity.update(deltaTime);

            entity._position.x += entity._velocity.x*deltaTime;
            this.tileCollider.checkX(entity);

            entity._position.y += entity._velocity.y*deltaTime;
            this.tileCollider.checkY(entity);

            entity._velocity.y += this.gravity * deltaTime;
           // this.tileCollider.test(entity);
           
        });
        this.totalTime += deltaTime;
    }
}