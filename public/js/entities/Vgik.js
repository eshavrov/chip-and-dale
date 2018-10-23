import Entity from '../Entity.js';
import { loadSpriteSheet } from '../loaders.js';

export function loadVgik() {
    return loadSpriteSheet('vgik')
        .then(createVgikFactory);
}

function createVgikFactory(sprite) {
    function drawVgik(context) {
        sprite.draw('vgik-1', context, 0, 0);
    }

    return function createVgik() {
        const vgik = new Entity();
        vgik.size.set(16, 16);
        vgik._velocity.x = -30;
        vgik.draw = drawVgik;
        return vgik;
    }
}