import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Routes from '../../pages/Routes';


// @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@1,700&display=swap');

import store from './../../Redux';

function App() {


  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
