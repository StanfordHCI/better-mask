import React from 'react';

const LoadingScreen = (props) => {
  return <div><h1>{props.loadingMessage || "Loading..."}</h1></div>
}

export default LoadingScreen;