import React from 'react';
import Offer from './components/Offer';

import tori from './img/tori.png';
import dti from './img/dti.png';

const promotions = [
  {
    name: 'DTI promotion',
    description: 'Earn 1 DTI Coin for each friend who joins DTI network. They also get a free DTI Coin',
    appSlug: 'dti',
    imgSrc: dti,
    stats: {
      clicks: 15,
      success: 3,
      earnings: 36,
      currency: 'DTI'
    }
  },
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
          </div>
        </div>
      </div>
    )
  }
}
