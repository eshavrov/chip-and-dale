import {Vector} from './math.js';

export default class Camera{
    constructor(){
        this._position = new Vector();
        this.size = new Vector(400, 224);
    }
}