import React from 'react';
import styled from "styled-components";
import {Button, Icon} from "@material-ui/core";
import FlatLink from 'components/FlatLink';
import {REFERRALS_ROUTE} from 'routes';

const Wrapper = styled.div`
  height: 300px;
  background: white;
  color: black;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid ${p => p.theme.colors.divider};
`;

export default function NewsCarousel(props) {
  return (
    <Wrapper>
      <h1>New cryptocurrency launching!</h1>
      <p>It's being given away for free!</p>

      <div style={{ marginBottom: 32 }}>
        <FlatLink to={REFERRALS_ROUTE}>
          <Button variant="raised" color="primary" style={{ height: 64, paddingLeft: 32, paddingRight: 32, fontSize: '1.2em' }}>
            <Icon className="fa fa-coins" style={{marginRight: 16}} />
            Check it out
          </Button>
        </FlatLink>
      </div>

      <a style={{color: 'inherit', textDecoration: 'underline'}} href="https://example.com" target="_blank" rel="noopener noreferrer">Learn more</a>
    </Wrapper>
  );
}
