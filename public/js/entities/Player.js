import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import Jump from '../traits/Jump.js';
import { loadSpriteSheet } from '../loaders.js';

export function loadPlayer() {
    return loadSpriteSheet('chip')
        .then(createPlayerFactory);
}

function createPlayerFactory(sprite) {
    console.log(sprite)
    // console.log('Creating support functions');

    // const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 18);
    const runAnim = sprite.animations.get('run');

    function routeFrame(player) {
        if (player.jump.falling) {
            return 'jump';
        }
        if (player.go.distance > 0) {
            return runAnim(player.go.distance);
        }
        return 'idle';
    }

    function drawPlayer(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
    }

    return function createPlayer() {
        const player = new Entity();
        player.size.set(19, 24);

        player.addTrait(new Go());
        player.addTrait(new Jump());

        player.draw = drawPlayer;

        return player;
    }
}