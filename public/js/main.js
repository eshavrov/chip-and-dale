import Timer from './Timer.js';
import Camera from './Camera.js';
import { loadLevel } from './loaders/level.js';
import { loadPlayer } from './entities/Player.js';
import { loadVgik } from './entities/Vgik.js';

import { setupKeyboard } from './input.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([
    loadPlayer(),
    loadVgik(),
    loadLevel('level-1')
])
    .then(([createPlayer, createVgik, level]) => {
        const camera = new Camera();

        const player = createPlayer();
        player._position.set(24, 100);
        level.entities.add(player);

        const vgik = createVgik();
        vgik._position.set(14,70);
        level.entities.add(vgik);

        player.addTrait({
            NAME: 'hacktrait',
            spawnTimeout: 0,
            obstruct() {

            },
            update(player, deltaTime) {
                if (this.spawnTimeout > 0.1 && player._velocity.y < 0) {
                    // const spawn = createVgik();
                    // spawn._position.x = player._position.x;
                    // spawn._position.y = player._position.y;
                    // spawn._velocity.y = player._velocity.y-200;
                    // level.entities.add(spawn);
                    this.spawnTimeout = 0;
                }
                this.spawnTimeout += deltaTime;
            }
        })

        

        const input = setupKeyboard(player);
        input.listenTo(window);

        const timer = new Timer(1 / 60);
        
        timer.update = function update(deltaTime) {
            level.update(deltaTime);
            if (player._position.x > 120) {
                camera._position.x = player._position.x - 120;
            }
            if (player._position.x < 0) {
                player._position.x = 0;
            }
            level.compositor.draw(context, camera);
        }

        timer.start();
    });







