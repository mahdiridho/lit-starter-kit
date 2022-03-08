export const INIT_METADATA = 'INIT_METADATA';
export const SET_NAME = 'SET_NAME';

export const initMetadata = (metadata) => {
  return {
    type: INIT_METADATA,
    metadata
  };
}

export const setName = (name) => {
  return {
    type: SET_NAME,
    name
  };
}