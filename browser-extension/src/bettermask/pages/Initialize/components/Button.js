import React from 'react';
import {colors} from 'theme';

const BUTTON_STYLE = {
  height: "54px",
  width: "198px",
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, .14)",
  color: "#fff",
  fontSize: "20px",
  fontWeight: "500",
  lineHeight: "26px",
  textAlign: "center",
  textTransform: "uppercase",
  margin: "35px 0 14px",
  transition: "200ms ease-in-out",
  backgroundColor: colors.primary,
};


export default (props) => {
  const {style, ...rest} = props;
  return (
    <button style={{...BUTTON_STYLE, ...style}} {...rest} />
  )
}