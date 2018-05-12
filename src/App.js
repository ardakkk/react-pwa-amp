/*** src/index.js   ***/
import React from 'react';
import { hot } from 'react-hot-loader';
import MyComponent from './components/MyComponent';


const App = () => <MyComponent />;
export default hot(module)(App);