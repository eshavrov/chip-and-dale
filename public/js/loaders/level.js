import Level from '../Level.js';
import { createBackgroundLayer, createSpriteLayer } from '../layers.js';
import { loadJSON, loadSpriteSheet } from '../loaders.js';
import {Matrix} from '../math.js';



export function loadLevel(name) {
    return loadJSON(`./levels/${name}.json`)
        .then(levelSpec => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet),

        ]))
        // Promise.all([
        //     loadJSON(`./levels/${name}.json`),
        //     loadSpriteSheet('overworld'),
        //     // loadBackgroundSprites()
        // ])
        .then(([levelSpec, backgroundSprites]) => {
            const level = new Level();

            const mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
                return mergedTiles.concat(layerSpec.tiles);
            }, []);

            const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
            level.setCollisionGrid(collisionGrid);

            levelSpec.layers.forEach(layer => {
                const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
                const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
                level.compositor.add(backgroundLayer);
            })
            

            const spriteLayer = createSpriteLayer(level.entities);
            level.compositor.add(spriteLayer);
            return level;
        })
}

function createCollisionGrid(tiles, patterns){
    const grid = new Matrix();
    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, { type: tile.type || "none" });
    }

    return grid;
}

function createBackgroundGrid(tiles, patterns){
    const grid = new Matrix();
    for (const {tile, x, y} of expandTiles(tiles, patterns)) {
        grid.set(x, y, { name: tile.name});
    }

    return grid;
}

function* expandSpan(xStart, xLen, yStart, yLen, temp = 0, span) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; x++) {
        for (let y = yStart; y < yEnd; y++) {
            if (temp == 0 || x % temp === span) {
                yield { x, y };
            }
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);
    } else
        if (range.length === 2) {
            const [xStart, yStart] = range;
            return expandSpan(xStart, 1, yStart, 1);
        } else
            if (range.length === 3) {
                const [xStart, xLen, yStart] = range;
                return expandSpan(xStart, xLen, yStart, 1);
            } else if (range.length === 6) {
                const [xStart, xLen, yStart, yLen, temp, span] = range;
                return expandSpan(xStart, xLen, yStart, yLen, temp, span);
            }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        for (const item of expandRange(range)) {
            yield item;
        }
    }


}

function expandTiles(tiles, patterns) {
    const expandedTiles = [];
    function walkTiles(tiles, offsetX, offsetY) {
        for (const tile of tiles) {
            for (const { x, y } of expandRanges(tile.ranges)) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;

                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    walkTiles(tiles, derivedX, derivedY);
                } else {
                    expandedTiles.push({
                        tile,
                        x: derivedX,
                        y: derivedY
                    });

                    // level.tiles.set(derivedX, derivedY, {
                    //     name: tile.name,
                    //     type: tile.type || "none"
                    // });
                }
            }
        }
    }
    walkTiles(tiles, 0, 0);
    return expandedTiles;
}