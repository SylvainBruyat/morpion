const App = {
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetButton: document.querySelector('[data-id="reset-btn"]'),
    newRoundButton: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalButton: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  state: {
    moves: [],
  },

  getGameResult(moves) {
    const p1Moves = moves.filter((move) => move.playerId === 1).map((move) => move.squareId);
    const p2Moves = moves.filter((move) => move.playerId === 2).map((move) => move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [1, 4, 7],
      [1, 5, 9],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    for (let pattern of winningPatterns) {
      const p1Wins = pattern.every((v) => p1Moves.includes(v)); //p1Moves.includes(pattern);
      const p2Wins = pattern.every((v) => p2Moves.includes(v)); //p2Moves.includes(pattern);

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    }

    return {
      status: moves.length === 9 || winner !== null ? 'completed' : 'in-progress',
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener('click', () => {
      App.$.menuItems.classList.toggle('hidden');
    });
    //TODO
    App.$.resetButton.addEventListener('click', () => {});

    App.$.modalButton.addEventListener('click', (evt) => {
      App.state.moves = [];
      App.$.turn.classList.remove('player2');
      App.$.turn.classList.add('player1');
      const turnIcon = document.createElement('i');
      const turnLabel = document.createElement('p');
      turnLabel.textContent = `Joueur 1, à ton tour !`;
      turnIcon.classList.add('fa-solid', 'fa-x');
      App.$.turn.replaceChildren(turnIcon, turnLabel);
      for (let square of App.$.squares) square.replaceChildren();
      App.$.modal.classList.add('hidden');
    });
    //TODO
    App.$.newRoundButton.addEventListener('click', () => {});
    //TODO
    App.$.squares.forEach((square) => {
      square.addEventListener('click', () => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find((move) => move.squareId === squareId);
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) return;

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => {
          return playerId === 1 ? 2 : 1;
        };
        const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement('i');
        const turnIcon = document.createElement('i');
        const turnLabel = document.createElement('p');
        turnLabel.textContent = `Joueur ${nextPlayer}, à ton tour !`;

        if (currentPlayer === 1) {
          squareIcon.classList.add('fa-solid', 'fa-x', 'player1');
          turnIcon.classList.add('fa-solid', 'fa-o');
          App.$.turn.classList.remove('player1');
          App.$.turn.classList.add('player2');
        } else {
          squareIcon.classList.add('fa-solid', 'fa-o', 'player2');
          turnIcon.classList.add('fa-solid', 'fa-x');
          App.$.turn.classList.remove('player2');
          App.$.turn.classList.add('player1');
        }
        square.replaceChildren(squareIcon);

        App.$.turn.replaceChildren(turnIcon, turnLabel);
        //App.$.turn.classList;

        App.state.moves.push({ squareId: +square.id, playerId: currentPlayer });

        const gameResult = App.getGameResult(App.state.moves);
        if (gameResult.status === 'completed') {
          App.$.modal.classList.remove('hidden');
          let message = '';
          if (gameResult.winner) {
            message = `Joueur ${gameResult.winner} a gagné !`;
          } else {
            message = 'Match nul !';
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener('load', App.init);
