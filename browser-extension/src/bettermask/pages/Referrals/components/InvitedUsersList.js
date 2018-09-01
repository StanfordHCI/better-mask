import React from 'react';
import { Flex, Box } from 'grid-styled';

export default function InvitedUsersList(props) {
  const {invitedUsers} = props;
  const slice = invitedUsers.slice(0, 7);

  return (
    <div>
      <Flex flexWrap="wrap" justifyContent="space-evenly">
        {
          slice.map((u, i) => (
            <Box py={2} key={i}>
              <div style={{height: 96, width: 96, margin: '0 16px', borderRadius: 48}} title={u.name}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg/600px-Default_profile_picture_%28male%29_on_Facebook.jpg"
                  alt=""
                  style={{height: 96, width: 96, borderRadius: 48}} />
              </div>
            </Box>
          ))
        }

        {
          invitedUsers.length > 8 &&
            <Box py={2}>
              <div style={{height: 96, width: 96, margin: '0 16px', borderRadius: 48, background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p style={{color: 'white', fontWeight: 'bold'}}>+{invitedUsers.length - 8}</p>
              </div>
            </Box>
        }
      </Flex>
    </div>
  )
}
