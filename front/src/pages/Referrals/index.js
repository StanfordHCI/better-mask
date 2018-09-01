import React from 'react';
import Offer from './components/Offer';

import tori from './img/tori.png';

const promotions = [
  {
    name: 'Tori.Land promotion',
    description: 'Earn 1 π for each friend who joins Tori.Land! They also get a free Tori.',
    appSlug: 'toris',
    imgSrc: tori,
    stats: {
      clicks: 15,
      success: 3,
      earnings: 36,
    }
  },
  {
    name: 'CryptoKitties promotion',
    description: 'Earn 8 π for each friend who joins and purchases a Gen. 0 kitty.',
    appSlug: 'kitties',
    imgSrc: 'https://www.cryptokitties.co/icons/logo.svg',
    stats: {
      clicks: 12,
      success: 2,
      earnings: 9,
    }
  }
];


export default class Offers extends React.Component {
  render() {
    return (
      <div style={{height: 'calc(100% - 64px)'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: 'calc(100% - 64px)'}}>
          <div style={{width: '100%', minHeight: '100%'}}>
            {
              promotions.map((p, i) => {
                return (
                  <Offer key={i} offer={p} />
                );
              })
            }

            <div style={{textAlign: 'center', marginTop: 96, marginBottom: 96}}>More promotions coming soon! Stay tuned!</div>
          </div>
        </div>
      </div>
    )
  }
}
