import { createStore } from 'redux';
import { rootReducer } from './reducer';

const store = createStore(rootReducer);

// function in store to get the current state
// store.getState();

export default store;