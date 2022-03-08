import {
  INIT_METADATA,
  SET_NAME
} from './actions';

const INITIAL_STATE = {
  metadata: {},
  name: 'Papua'
};

const app = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_METADATA:
      return {
        ...state,
        metadata: action.metadata
      };
    case SET_NAME:
      return {
        ...state,
        name: action.name
      };
    default:
      return state;
  }
};

export default app;
