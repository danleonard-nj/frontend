import { setAlert } from './alertSlice';

class AlertActions {
  getAlertSuccess = (message) => {
    return {
      isOpen: true,
      severity: 'success',
      message: message,
    };
  };

  getAlertFailure = (error) => {
    return {
      isOpen: true,
      severity: 'error',
      message: error,
    };
  };

  popMessage = (message) => {
    return async (dispatch, getState) => {
      const alert = this.getAlertSuccess(message);
      dispatch(setAlert(alert));
    };
  };

  popErrorMessage = (message) => {
    return async (dispatch, getState) => {
      const alert = this.getAlertFailure(message);
      dispatch(setAlert(alert));
    };
  };
}

export const { popErrorMessage, popMessage } = new AlertActions();
