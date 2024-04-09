import { Action } from "redux";

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

type ActionHandlers<S> = {
  [type: string]: (state: S, action: any) => S;
};

export function createReducer<TState>(
  initialState: TState,
  handlers: ActionHandlers<TState>
) {
  return function reducer(state: TState = initialState, action: Action) {
    state ??= initialState;
    const handler = handlers[action.type];

    return handler?.(state, action) ?? state;
  };
}
