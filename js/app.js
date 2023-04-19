import View from './view.js';
import Store from './store.js';

const players = [
  { id: 1, name: 'Joueur 1', iconClass: 'fa-x', colorClass: 'player1' },
  { id: 2, name: 'Joueur 2', iconClass: 'fa-o', colorClass: 'player2' },
];

function init() {
  const view = new View();
  const store = new Store('morpion-key', players);

  store.addEventListener('state-change', () => {
    view.render(store.game, store.stats);
  });

  view.render(store.game, store.stats);

  window.addEventListener('storage', () => {
    view.render(store.game, store.stats);
  });

  view.bindGameResetEvent(() => {
    store.reset();
  });

  view.bindNewRoundEvent(() => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find((move) => move.squareId === +square.id);
    if (existingMove) return;

    store.playerMove(+square.id);
  });
}

window.addEventListener('load', init);
