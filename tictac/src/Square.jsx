import React from 'react';
import './index.css';

// eslint-disable-next-line react/prop-types
const Square = ({ value, handleClick }) => (
  <button type="button" className="square" onClick={handleClick}>
    {value}
  </button>
);
export default Square;
