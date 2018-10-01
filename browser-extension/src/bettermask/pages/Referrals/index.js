import React from 'react';
import {connect} from 'react-redux';

import {fetchOffers} from 'data/offers';

import {CircularProgress} from '@material-ui/core';
import Offer from './components/Offer';

class Offers extends React.Component {
  componentDidMount() {
    this.props.fetchOffers();
  }

  render() {
    if (this.props.loading || !this.props.offers){
      return (
        <div style={{height: 'calc(100% - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <CircularProgress />
        </div>
      );
    }
    
    return (
      <div style={{height: 'calc(100% - 64px)'}}>
        <div style={{display: 'flex', flexDirection: 'row', height: 'calc(100% - 64px)'}}>
          <div style={{width: '100%', minHeight: '100%'}}>
            {
              this.props.offers.map((offer, i) => {
                console.log(this.props.stats)
                console.log(this.props.referralLinks)
                const stats = this.props.stats[offer.appSlug];
                const referralLink = this.props.referralLinks[offer.appSlug];
                return (
                  <Offer key={i} offer={offer} stats={stats} referralLink={referralLink} />
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({
  offers: state.offers.offers,
  stats: state.offers.stats,
  referralLinks: state.offers.referralLinks,
  loading: state.offers.loading,
}), (dispatch) => ({
  fetchOffers: () => dispatch(fetchOffers()),
}))(Offers);
