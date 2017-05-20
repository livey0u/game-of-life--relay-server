# Game Of Life

## Rules

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overcrowding.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

## Application requirements

1. When a dead cell revives by rule #4 “Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.”, it will be given a color that is the average of its neighbours (that revive it).
2. Each client is assigned a random color on initialization. From the browser, clicking on any grid will create a live cell on that grid with the client’s color. `color is generated based on ip address of the client`

