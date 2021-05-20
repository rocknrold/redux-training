// console.log("Hello World!");

// function sayHello() {
//     return "Hellow";
// }

// function passHello(callback) {
//     return `${callback()} world`; 
// }

// function returnFunction() {
//     return function(){
//         return "Hello World";
//     }
// }

// let fn = sayHello;
// console.log(fn());

// let pfn = passHello(sayHello);
// console.log(pfn);

// let rfn = returnFunction();
// console.log(rfn());

// REDUX TUTORIAL

import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';

const defaultState = {
    authenticated: false
};


// ACTIONS 
// this is a js object that has a required key of 'type'
// type: defines what action is done. Ito ay ipapasa sa
// store at ang store ang iexecute based sa type ng action
// at i-identify ito gamit ang reducers 
// const action = {
//     type: 'LOGIN'
// }  

// Actions by convetion are const with UPPERCASE
// This will be then referenced to other parts of the app
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const ADD_NOTE = 'ADD_NOTE';
const GET_USERS = 'GET_USERS';
const GET_SUCCESS_USERS = 'GET_SUCCESS_USERS';
const GET_ERROR_USERS = 'GET_ERROR_USERS';

// ACTION CREATOR
// action creator is simply a js function
// that creates an object and returns an action.
const loginAction = () =>{
    return {
        type : LOGIN
    }
};

const logoutAction = () => {
    return {
        type: LOGOUT
    }
};


// ACTIONS WITH PAYLOAD

const addNoteAction = (note) => {
    return {
        type: ADD_NOTE,
        text: note
    }
};


//Responding to the action passed/dispatched on the STORE
// This is where reducer comes in play 

//Reducers in redux are responsible on the modification of
// states as a response to the action dispatched on the store.

// Reducer takes in an argument of state and action. 
// Remeber that reducers are pure functions
// Returns only a new copy of the state. 
const authreducer = (state = defaultState, action) => {
    switch(action.type) {
        case LOGIN:
            return {...state, authenticated:true};
        case LOGOUT:
            return {...state, authenticated:false};
        default:
            return state;
    }
};


// REDUCER COMPOSITION 

// Counter Reducer ex to demonstrate multi reducer

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case INCREMENT:
            return {...state, state : state + 1 };
        case DECREMENT:
            return {...state, state : state - 1 };
        default:
            return state;
    }
};

// Reducer that updates PAYLOAD

const noteReducer = (state = 'Initial Note', action) => {
    switch (action.type) {
        case ADD_NOTE:
            return action.text;
        default:
            return state;
    }
}


// // The most common use of Redux Thunk is for communicating
// // asynchonously with an external API to retrieve or save data.
const userState = {
    fetch_status: '',
    users: [],
    error: ''
};

const fetchUser = () => {
    return {
        type: GET_USERS
    }
}

const fetchSuccess = users => {
    return {
        type: GET_SUCCESS_USERS,
        payload: users
    }
}

const fetchError = error => {
    return {
        type: GET_ERROR_USERS,
        payload : error
    }
}


const userReducer = (state = userState, action) => {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                fetch_status:'FETCHING'
            }
        case GET_SUCCESS_USERS:
            return {
                ...state,
                fetch_status:'SUCCESS',
                users:action.payload
            }
        case GET_ERROR_USERS:
            return {
                ...state,
                fetch_status:'ERROR',
                error:action.payload
            }
        default:
            return state;
    }
}


const fetchUsers = () => {
    return function(dispatch){
        dispatch(fetchUser());
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            const users = response.data;
            console.log(users);
            // dispatch(fetchSuccess(users));
            dispatch({type:GET_SUCCESS_USERS, payload:response.data});
        })
        .catch(error => {
            // dispatch(fetchError(error.message));
            dispatch({type:GET_ERROR_USERS, payload:error.message})
        })
    }
}


// If there are multiple reducer Redux provides composition
// Redux.combineReducers()
// accepts and object key:value 
const rootReducer = combineReducers({
    auth: authreducer,
    counter: counterReducer,
    note: noteReducer,
    user: userReducer
});

// The store accepts an reducer function as argument
// if not multiple reducer pass directly the reducer
// else pass the root reducer that utilizes the combineReducers

// const store = createStore(rootReducer);

// the second optional argument for createStore is the middleware
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// const store = createStore(userReducer, applyMiddleware(thunkMiddleware));

// Store function to get the current state of the store object/data
// console.log('Store created: ',store.getState());



// store.subscribe(callback)
//it will run everytime a dispatch is sent through the store
//can be assigned to a const of unsubscribe

// const dispatchListener = () => {
//     console.log('Subscribed run!');
// }

// const unsubscribe = store.subscribe(dispatchListener);

store.subscribe(() => { console.log(store.getState()) })
// store.subscribe(() => { console.log(store.getState()) })


// store.dispatch()
// it will accept an action as an argument
// this could be an object or an action creator
// it will then responsible to send action to the store
// and match reducer case 
// store.dispatch(loginAction());
// this is exactly the same as the loginAction;
store.dispatch({type:'LOGIN'});

// console.log('LOGIN : ',store.getState());

store.dispatch(logoutAction());

// console.log('LOGOUT : ',store.getState());

// DISPATCHING ACTION WITH PAYLOAD

store.dispatch(addNoteAction('This is add note'));

// ASYNCHRONOUS ACTION API CALL
store.dispatch(fetchUsers())