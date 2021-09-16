import React,{ useState }from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const Square = ({value,handleClick}) =>{
      return (
        <button className="square" onClick={handleClick}>{value}</button>
      );
}
export default Square;