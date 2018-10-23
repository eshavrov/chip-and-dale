import TileResolve from "./TileResolve.js";

export function createBackgroundLayer(level, tiles, sprites) {
    const resolver = new TileResolve(tiles);//level.tileCollider.tiles;
    const buffer = document.createElement('canvas');
    buffer.width = 400 + 16;
    buffer.height = 224;
    const context = buffer.getContext('2d');
    
    function redraw(startIndex, endIndex) {
        context.clearRect(0,0,buffer.width, buffer.height)
        for (let x = startIndex; x <= endIndex; x++) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    if (sprites.animations.has(tile.name)) {
                        sprites.drawAnim(tile.name, context, x - startIndex, y, level.totalTime);
                    } else {
                        sprites.drawTile(tile.name, context, x - startIndex, y);
                    }
                });
            }
        }
    }

    // level.tiles.forEach((tile, x, y) => {
    //     sprites.drawTile(tile.name, context, x, y);
    // });

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera._position.x);
        const drawTo = drawFrom + drawWidth;
        redraw(drawFrom, drawTo);

        context.drawImage(buffer,
            Math.floor(-camera._position.x % 16),
            Math.floor(-camera._position.y));
    }
}

export function createSpriteLayer(entities, width = 64, height = 64) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height)
            entity.draw(spriteBufferContext);
            context.drawImage(spriteBuffer,
                Math.floor(entity._position.x - camera._position.x),
                Math.floor(entity._position.y - camera._position.y)
            )
        });

    }
}

export function createCollisionLayer(level) {
    const resolvedTiles = [];
    const tileResolver = level.tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexFake(x, y) {
        resolvedTiles.push({ x, y });
        return getByIndexOriginal.call(tileResolver, x, y);
    }
    return function drawCollision(context, camera) {
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({ x, y }) => {
            // console.log('Would draw', x, y);
            context.beginPath();
            context.rect(
                x * tileSize + 0.5 - camera._position.x,
                y * tileSize + 0.5 - camera._position.y,
                tileSize - 1,
                tileSize - 1
            );
            context.stroke();
            context.closePath();
        });
        context.strokeStyle = 'red';
        // console.log('---',level.entities);
        level.entities.forEach(({ _position, size }) => {
            context.beginPath();
            context.rect(
                Math.floor(_position.x) + 0.5 - camera._position.x,
                Math.floor(_position.y) + 0.5 - camera._position.y,
                size.x - 1,
                size.y - 1
            );
            context.stroke();
            context.closePath();
        })
        resolvedTiles.length = 0;
    };

}


export function createCameraLayer(cameraToDraw) {
    return function drawCameraRect(context, fromCamera) {
        context.strokeStyle = 'purple';
        context.beginPath();
        context.rect(
            cameraToDraw._position.x - fromCamera._position.x,
            cameraToDraw._position.y - fromCamera._position.y,
            cameraToDraw.size.x,
            cameraToDraw.size.y
        );
        context.stroke();
        context.closePath();
    };
}