/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import Auth from '../../../../auth/auth';
import axios from 'axios';
import { Text } from 'react-easy-i18n';
import { Collapse } from 'reactstrap';

export default class BillLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  /**
   * Collapse toggler
   */
  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

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
          <td onClick={this.toggle}>{this.props.item.number}</td>
          <td className="text-center" onClick={this.toggle}>{this.props.item.period}</td>
          <td className="text-center" onClick={this.toggle}>{this.props.item.total_value}</td>
          <td className="text-center">
            <button className="btn btn-sm btn-outline-success" onClick={this.toggleModal}><Text
              text="cabinet.billCard.pay"/></button>
          </td>
        </tr>
        <Collapse tag="tr" isOpen={this.state.isOpen}>
          {/*{this.props.bill.bill_lines[0] &&*/}
          <td style={{ padding: 0 }} colSpan={4}>
            {/*<div>{this.props.bill.bill_lines[0].previous_debt}</div>*/}
            <table className="table table-bordered table-hover table-sm">
              <thead>
              <tr>
                <th scope="col" style={{ width: '5%' }}><small>ТОВ "УК ДІМ"</small></th>
                <th scope="col" className="text-center" colSpan={10}><small>Квитанції на оплату комунальних послуг за
                  Січень 2020
                  р.</small></th>
              </tr>
              <tr>
                <th><small>33024, Рівненська обл., м. Рівне, вул. Макарова, 24 А</small></th>
                <th colSpan={5}><small>Черній Мирослав Валерійович</small></th>
                <th colSpan={5}><small>Особовий рахунок: 2314515</small></th>
              </tr>
              <tr>
                <th>
                  <small>р/р уа1254135431132541 ВАТ АБ "Укргазбанк" у м. Рівне ЄДРПОУ 38416999</small>
                </th>
                <th colSpan={5}><small>Адреса: Міцкевича 130, кв.53</small></th>
                <th colSpan={5}><small>Площа Загальна-59,300 м. кв.</small></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th rowSpan={2} className="text-center"><small>Вид послуг</small></th>
                <th rowSpan={2} className="text-center"><small>Борг на поч. місяця, грн.</small></th>
                <th rowSpan={2} className="text-center"><small>Оплачено, грн</small></th>
                <th rowSpan={2} className="text-center"><small>Субсидія, грн</small></th>
                <th colSpan={3} className="text-center"><small>Показники лічильника</small></th>
                <th rowSpan={2} className="text-center"><small>Тариф, грн</small></th>
                <th rowSpan={2} className="text-center"><small>Нараховано, грн</small></th>
                <th rowSpan={2} className="text-center"><small>Пільга, грн</small></th>
                <th rowSpan={2} className="text-center"><small>Сума до оплати, грн</small></th>
              </tr>
              <tr>
                <th className="text-center"><small>Останній</small></th>
                <th className="text-center"><small>Попередній</small></th>
                <th className="text-center"><small>Різниця</small></th>
              </tr>
              <tr>
                <th><small>Управління будинком</small></th>
                <th className="text-center"><small>210.09</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>3.55</small></th>
                <th className="text-center"><small>210.52</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>420.61</small></th>
              </tr>
              </tbody>
            </table>
          </td>
        </Collapse>
      </>
    );
  }
}