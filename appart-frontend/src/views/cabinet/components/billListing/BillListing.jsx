/**
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import axios from 'axios';
import Auth from '../../../../auth/auth';
import { Text } from 'react-easy-i18n';
import { UserConsumer } from '../../../../globalContext/userContext';

export default class BillListing extends React.Component {
  /**
   * Bill list constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      paginationCount: '',
      paginationNext: '',
      paginationPrevious: ''
    };
    this.user = new Auth();
    this.toggleModal = this.toggleModal.bind(this);
  }

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType = UserConsumer;

  componentDidMount() {
    if (this.context) {
      axios(`${process.env.REACT_APP_GET_BILLS}${this.context.apartment[0].pk}/`, {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
        }
      })
        .then(
          result => {
            this.setState({
              isLoaded: true,
              data: result.data.results,
              paginationCount: result.data.count,
              paginationNext: result.data.next,
              paginationPrevious: result.data.previous
            });
          },
          error => {
            this.setState({
              isLoaded: true
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
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          {/*
           // @ts-ignore*/}
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <div className="table-account shadow-sm py-2 px-4 ">
          <table className="table bg-white table-striped ">
            <thead className="one">
            <tr className="">
              <th className="text-center" scope="col">Номер рахунку</th>
              <th className="text-center" scope="col">Виписаний</th>
              <th className="text-center" scope="col">Сума</th>
              <th className="text-center" scope="col">Дії</th>
            </tr>
            </thead>
            <tbody>
            {this.state.data.map((item) => (
              <tr style={{ cursor: 'pointer' }}>
                <td>{item.number}</td>
                <td className="text-center">{item.period}</td>
                <td className="text-center">{item.total_value}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-success" onClick={this.toggleModal}>Оплатити</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}