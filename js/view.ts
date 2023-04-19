import type { DerivedStats, Game, Move, Player } from './types';

export default class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.menu = this.#selectElement('[data-id="menu"]');
    this.$.menuButton = this.#selectElement('[data-id="menu-btn"]');
    this.$.menuItems = this.#selectElement('[data-id="menu-items"]');
    this.$.resetButton = this.#selectElement('[data-id="reset-btn"]');
    this.$.newRoundButton = this.#selectElement('[data-id="new-round-btn"]');
    this.$.modal = this.#selectElement('[data-id="modal"]');
    this.$.modalText = this.#selectElement('[data-id="modal-text"]');
    this.$.modalButton = this.#selectElement('[data-id="modal-btn"]');
    this.$.turn = this.#selectElement('[data-id="turn"]');
    this.$.p1Wins = this.#selectElement('[data-id="p1-wins"]');
    this.$.p2Wins = this.#selectElement('[data-id="p2-wins"]');
    this.$.ties = this.#selectElement('[data-id="ties"]');
    this.$.grid = this.#selectElement('[data-id="grid"]');

    this.$$.squares = this.#selectAllElement('[data-id="square"]');

    this.$.menuButton.addEventListener('click', () => {
      this.#toggleMenu();
    });
  }

  render(game: Game, stats: DerivedStats) {
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;
    const { playersWithStats, ties } = stats;
    const p1Wins = playersWithStats[0].wins;
    const p2Wins = playersWithStats[1].wins;

    this.#clearGameBoard();
    this.#updateScoreboard(p1Wins, p2Wins, ties);
    this.#closeAll();
    this.#initializeMoves(moves);

    if (isComplete) {
      const message = winner ? `${winner.name} a gagné !` : 'Match nul !';
      this.#openModal(message);
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  bindGameResetEvent(handler: EventListener) {
    this.$.resetButton.addEventListener('click', handler);
    this.$.modalButton.addEventListener('click', handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundButton.addEventListener('click', handler);
  }

  bindPlayerMoveEvent(handler: (el: Element) => void) {
    this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler);
  }

  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement('i');
    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  #setTurnIndicator(player: Player) {
    const icon = document.createElement('i');
    const label = document.createElement('p');

    icon.classList.add('fa-solid', player.iconClass, player.colorClass);
    label.classList.add(player.colorClass);
    label.textContent = `${player.name}, à ton tour !`;

    this.$.turn.replaceChildren(icon, label);
  }

  #clearGameBoard() {
    this.$$.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach((square) => {
      const existingMove = moves.find((move) => move.squareId === +square.id);
      if (existingMove) this.#handlePlayerMove(square, existingMove.player);
    });
  }

  #updateScoreboard(p1Wins: number, p2Wins: number, ties: number) {
    this.$.p1Wins.textContent = `${p1Wins} victoire(s)`;
    this.$.p2Wins.textContent = `${p2Wins} victoire(s)`;
    this.$.ties.textContent = `${ties} matchs nuls`;
  }

  #selectElement(selector: string, parent?: Element) {
    const el = parent ? parent.querySelector(selector) : document.querySelector(selector);
    if (!el) throw new Error('Could not find a game element');

    return el;
  }

  #selectAllElement(selector: string) {
    const elList = document.querySelectorAll(selector);
    if (!elList) throw new Error('Could not find game elements');

    return elList;
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle('hidden');
    this.$.menuButton.classList.toggle('border');

    const icon = this.#selectElement('i', this.$.menuButton);
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
  }

  #closeMenu() {
    this.$.menuItems.classList.add('hidden');
    this.$.menuButton.classList.remove('border');

    const icon = this.#selectElement('i', this.$.menuButton);
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  }

  #openModal(message: string) {
    this.$.modalText.textContent = message;
    this.$.modal.classList.remove('hidden');
  }

  #closeModal() {
    this.$.modal.classList.add('hidden');
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #delegate(el: Element, selector: string, eventKey: string, handler: (el: Element) => void) {
    el.addEventListener(eventKey, (evt) => {
      if (!(evt.target instanceof Element)) {
        throw new Error('Event target not found!')!;
      }
      if (evt.target.matches(selector)) handler(evt.target);
    });
  }
}
