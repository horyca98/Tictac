import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game";
import { Provider } from 'react-redux'
import {createStore, applyMiddleware,compose} from 'redux'
import game from "./reducers/gameReducer";
import thunk from 'redux-thunk'

const store = createStore(game,
  compose(applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__() && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
      )
    )

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Game />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );