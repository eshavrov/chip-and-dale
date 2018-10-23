import Entity, { Trait } from './Entity.js';
import Go from './traits/Go.js';
import Jump from './traits/Jump.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnim } from './animation.js'



export function createPlayer() {
    return loadSpriteSheet('chip')
        .then(sprite => {
            const player = new Entity();
            player.size.set(19, 24);

            player.addTrait(new Go());
            player.addTrait(new Jump());
            const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 18);
            function routeFrame(player) {
                if (player.jump.falling) {
                    return 'jump';
                }
                if (player.go.distance > 0) {
                    return runAnim(player.go.distance);
                }
                return 'idle';
            }

            player.draw = function drawPlayer(context) {
                sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
            };

            return player;
        });
}
