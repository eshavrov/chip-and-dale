import { Trait } from '../entity.js';

export default class Go extends Trait {
    constructor() {
        super('go');
        this.direction = 0;
        this.speed = 8000;
        this.acceleration = 700;
        this.deceleration = 600;
        this.dragFactor = 0


        this.distance = 0;
        this.heading = 1;
    }

    update(entity, deltaTime) {
        if (this.direction!=0) {
            // entity._velocity.x += this.acceleration * deltaTime * this.direction;
            entity._velocity.x = this.speed * deltaTime * this.direction;
            this.heading = this.direction;
            
        // } else if (entity._velocity.x!==0){

        //     const decel = Math.min(Math.abs(entity._velocity.x), this.deceleration*deltaTime);
        //     entity._velocity.x += entity._velocity.x> 0? - decel:decel;
        } else {
            entity._velocity.x =0;

            this.distance = 0;
        }
        const drag = this.dragFactor*entity._velocity.x*Math.abs(entity._velocity.x);

        entity._velocity.x -= drag;            
        this.distance += Math.abs(entity._velocity.x) * deltaTime;

    }
}