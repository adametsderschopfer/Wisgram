import React from 'react';
import { Provider } from 'react-redux';

// @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@1,700&display=swap');
import store from './../../Redux';

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        
      </Provider>
    </React.StrictMode>
  );
}

export default App;
