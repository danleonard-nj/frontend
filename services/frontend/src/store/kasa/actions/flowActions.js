import { updateFlow } from '../flowSlice';

export function updateFlowState(func) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(updateFlow(func(state.flow.flow)));
  };
}
