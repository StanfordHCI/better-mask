import React from 'react';
import {connect} from 'react-redux';

function Profile(props) {
  if (!props.profile) return null;
  return (
    <div style={{padding: 24}}>
      <h1>
        {props.profile.name}
      </h1>
    </div>
  )
}

export default connect((state) => ({
  profile: state.user.profile,
}), (dispatch) => ({
}))(Profile);
