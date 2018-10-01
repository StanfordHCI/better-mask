import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

const Category = styled.p`
  font-weight: bold;
  margin-bottom: 0;
  margin-top: 2px;
`;

const CategoryDetails = styled.p`
  color: lightgray;
  margin-bottom: 8px;
  margin-top: 0;
`;

export default function Stats(props) {
  const {stats} = props;
  return (
    <div>
      <Flex>
        <Box flex={1}>
          <Category>Clicks</Category>
          <CategoryDetails>Total number of people who clicked your referral link</CategoryDetails>
        </Box>
        <Box><div style={{paddingTop: 12, paddingLeft: 16, fontSize: '1.3em' }}>{stats.pending_referrals_count + stats.invited_users.length}</div></Box>
      </Flex>

      <Flex>
        <Box flex={1}>
          <Category>Pending reward</Category>
          <CategoryDetails>Amount you stand to earn if everybody who clicked your link joins</CategoryDetails>
        </Box>
        <Box><div style={{paddingTop: 12, paddingLeft: 16, fontSize: '1.3em' }}>{stats.pending_referrals_count * 20} ฿</div></Box>
      </Flex>

      <Flex>
        <Box flex={1}>
          <Category>Successfully joined</Category>
          <CategoryDetails>Number of people you referred who joined</CategoryDetails>
        </Box>
        <Box><div style={{paddingTop: 12, paddingLeft: 16, fontSize: '1.3em' }}>{stats.invited_users.length}</div></Box>
      </Flex>

      <Flex>
        <Box flex={1}>
          <Category>You already made</Category>
          <CategoryDetails>Amount you've been paid thanks to people you referred!</CategoryDetails>
        </Box>
        <Box><div style={{paddingTop: 12, paddingLeft: 16, fontSize: '1.3em' }}>{stats.invited_users.length * 20} ฿</div></Box>
      </Flex>
    </div>
  )
}
