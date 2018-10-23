export function setupMouseControl(canvas, entity, camera) {
    let lastEvent;
    ['mousedown', 'mousemove'].forEach(eventType => {
        canvas.addEventListener(eventType, ({ buttons, type, offsetX: mouseX, offsetY: mouseY }) => {

            if (buttons === 1) {
                entity._velocity.set(0, 0);
                entity._position.set(
                    mouseX + camera._position.x,
                    mouseY + camera._position.y
                );
            } else if (buttons === 2 && lastEvent && lastEvent.buttons === 2 && lastEvent.type === 'mousemove') {
                camera._position.x -= mouseX-lastEvent.mouseX;
            }

            lastEvent = {buttons, type, mouseX, mouseY};
        });
    });
    canvas.addEventListener('contextmenu', event => event.preventDefault())
};