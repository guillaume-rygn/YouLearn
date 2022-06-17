import React from 'react';
import ReactDOM from 'react-dom';
import Timestamp from './components/Timestamp';
import './style.scss';
//--------------------------------------


const App = () => {
  return(
    <>
      <Timestamp/>
    </>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"));
