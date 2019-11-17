export class State<SM extends StateMachine<any>> {
  sm: SM;
  constructor(sm: SM) {
    this.sm = sm;
  }
  setup() {}
  cleanup() {}

  setState(sm: State<SM>) {
    sm.setState(sm);
  }

  handleLeftJoyStick?: (x: number, y: number) => void;
}

export abstract class StateMachine<SM extends StateMachine<any>> {
  state: State<SM>;
  constructor() {
    this.state = this.getDefaultState();
  }
  abstract getDefaultState(): State<SM>;
  cleanup() {
    this.state.cleanup();
  }

  setState(newState: State<SM>) {
    this.state.cleanup();
    this.state = newState;
    this.state.setup();
  }

  get handleLeftJoyStick() {
    return this.state.handleLeftJoyStick;
  }
}
