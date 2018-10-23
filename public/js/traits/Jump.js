import { Trait, Sides } from '../entity.js';

export default class Jump extends Trait {
    constructor() {
        super('jump');
        this.ready = 0;
        this.duration = 0.2;
        this.velocity = 210;
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
    }

    get falling() {
        return this.ready < 0;
    }

    start() {
        this.requestTime = this.gracePeriod;
        // if (this.ready>0)
        // this.engageTime = this.duration;

    }

    cancel() {
        this.engageTime = 0;
    }

    obstruct(entity, side) {
        if (side === Sides.BOTTOM) {
            this.ready = 1;
        } else if (side === Sides.TOP) {
            this.cancel();
        }
    }

    update(entity, deltaTime) {
        // console.log('jump.ready', this.ready);
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration;
                this.requestTime = 0;
            }
            this.requestTime-=deltaTime;

        }


        if (this.engageTime > 0) {
            entity._velocity.y = -this.velocity;
            this.engageTime -= deltaTime;
        }
        this.ready--;
    }
}