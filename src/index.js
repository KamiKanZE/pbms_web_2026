// import React from 'react';
// import ReactDOM from 'react-dom';

// import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import App from './App';
import rootReducer from './reducers';
// import { fetchAllPosts } from 'actions/plan1';
// import { fetchAllPosts1 } from 'actions/budget';
import registerServiceWorker from './registerServiceWorker';
let store = createStore(rootReducer, applyMiddleware(thunk));
// const getBasename = () => {
//   return `/${process.env.PUBLIC_URL.split('/').pop()}`;
// };
// var onlyPath = require('path').dirname('src/pages/BudgetSources1');
// console.log(onlyPath);
// const token_id = localStorage.getItem('token');

// store.dispatch(fetchAllPosts());
// store.dispatch(fetchAllPosts1());
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
