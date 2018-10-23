export default class Compositor {
    constructor(){
        this._layers = [];
    }

    draw(context, camera) {
        this._layers.forEach(layer => {
            layer(context, camera);
        });
    }

    add(...layer) {
        this._layers.push(...layer)
    }
}