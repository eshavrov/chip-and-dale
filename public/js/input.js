import Keyboard from './KeyboardState.js';

export function setupKeyboard(player) {
    const input = new Keyboard();

    input.addMapping('Space', keyState => {
        if (keyState) {
            player.jump.start();
        } else {
            player.jump.cancel();
        }
    });
    input.addMapping('ArrowUp', keyState => {
        if (keyState) {
            player.jump.start();
        } else {
            player.jump.cancel();
        }
    });

    input.addMapping('ArrowRight', keyState => {
        player.go.direction += keyState ? 1 : -1;
    });

    input.addMapping('ArrowLeft', keyState => {
        player.go.direction += -keyState ? -1 : 1;
    });
    return input;
}