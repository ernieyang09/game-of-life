# Game of Life

This is POC for multiplayer play conway game in the same place.

## Dockerfile

This is for production release, I didn't write for dev purpose one. Total spend time is less than 4 hrs.

## How to start

```
cd fe
pnpm install
cp .env.example .env
pnpm dev
```

```
cd be
pnpm install
pnpm dev
```

## Functionality

- Multiplayer
- Pattern select
- Clean board
- Average color

## Architecture

### FE

React + canvas, I want to limit grid in 100 \* 100 in the beginning. So we can use dom manipulation.

In the end, I still use canvas(from chatgpt)

### BE

node js, websocket. We need to sync and share the same state for all players.

## Improvement

- BE can be ESM model, just not setup
- Need to extract config and env var. If setup is correct, BE and FE and share some config in one folder
- Typescript
- Testing, since there's no testing. I don't write for github workflow.
- UI enchancement, like layout, active status for pattern,
- Algo enchancement, right now the time complexity is O(n^2), since most of cell should be empty, we can consider to use sparse hashmap. (Like the value I return to FE)
- Redesign payload with websocket, I pass the color to the FE but I didn't use it. Try to reduce payload size.
- Extract state from BE, it will have scale issue(can't open many instance). But it's ok for POC.
- Refactor the code, it's kinda dirty..
- More feature, like stop game, next tick, user select color from FE.....

## Project

For the detail designed game. Can check this.

- https://github.com/ernieyang09/react-2048
- https://github.com/ernieyang09/react-2048-sol
