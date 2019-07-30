import React from 'react';
import './App.scss';
import configureStore from './redux/store';
import { Provider as ReduxProvider } from "react-redux";
import Home from './components/home';

//configuring store
const reduxStore = configureStore();

function App() {
  return (
    <ReduxProvider store={reduxStore}>
      <Home />
    </ReduxProvider>
  );
}

export default App;
