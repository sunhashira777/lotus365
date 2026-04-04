import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import 'react-datepicker/dist/react-datepicker.css'; // Default styles
import { Provider } from 'react-redux';
import { store } from './api';

const MOUNT_NODE = document.getElementById('app');

const root = ReactDOM.createRoot(MOUNT_NODE);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
