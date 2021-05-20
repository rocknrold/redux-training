// ACTIONS 
// this is a js object that has a required key of 'type'
// type: defines what action is done. Ito ay ipapasa sa
// store at ang store ang iexecute based sa type ng action
// at i-identify ito gamit ang reducers 
const action = {
    type: 'LOGIN'
}


// ACTION CREATOR
// action creator is simply a js function
// that creates an object and returns an action.
const actionCreator = () =>{
    return action;
  }