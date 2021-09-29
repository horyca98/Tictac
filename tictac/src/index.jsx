import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game";
import { Provider } from 'react-redux'
import {createStore} from 'redux'
import game from "./reducers/gameReducer";

const store = createStore(game,
    window.__REDUX_DEVTOOLS_EXTENSION__() && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    )

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Game />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );