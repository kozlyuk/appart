/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import Auth from '../../../../auth/auth';
import axios from 'axios';

export default class BillLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  /**
   * User object
   */
  user = new Auth();


  componentDidMount() {
    /**
     * Url for get api tokens
     */
    const urlApiToken = process.env.REACT_APP_GET_PAYMENTS_TOKEN;

    if (this.props.item) {
      const { pk } = this.props.item;
      axios(`${urlApiToken}/${pk}/`, {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
        }
      })
        .then(
          result => {
            const { signature } = result.data;
            this.setState({
              isLoaded: true,
              liqPayData: result.data.data,
              liqPaySign: signature
            });
          },
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    }
  }

  /**
   * Modal toggler
   *
   * @returns {function(...[*]=)}
   */
  toggleModal() {
    const { liqPayData } = this.state;
    const { liqPaySign } = this.state;
    global.LiqPayCheckout.init({
      data: liqPayData,
      signature: liqPaySign,
      embedTo: '#liqpay_checkout',
      language: 'ru',
      mode: 'popup' // embed || popup
    }).on('liqpay.callback', function(data) {
      console.log(data.status);
      console.log(data);
    }).on('liqpay.ready', function(data) {
    }).on('liqpay.close', function(data) {
    });
  };


  render() {
    return (
      <>
        <tr style={{ cursor: 'pointer' }}>
          <td>{this.props.item.number}</td>
          <td className="text-center">{this.props.item.period}</td>
          <td className="text-center">{this.props.item.total_value}</td>
          <td className="text-center">
            <button className="btn btn-sm btn-outline-success" onClick={this.toggleModal}>Оплатити</button>
          </td>
        </tr>
      </>
    );
  }
}