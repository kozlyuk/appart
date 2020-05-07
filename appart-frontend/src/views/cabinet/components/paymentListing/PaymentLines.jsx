/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Collapse } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import Auth from '../../../../auth/auth';
import axios from 'axios';

export default class PaymentLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isLoaded: true
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

    if (this.props.payment) {
      const { pk } = this.props.payment;
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

  /**
   * Collapse toggler
   */
  toggle = () => {
    const { isOpen } = this.state;
    if (this.props.payment.payment_service[0]) {
      this.setState({
        isOpen: !isOpen
      });
    }
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
        <>
          <tr style={{ cursor: 'pointer' }}>
            <td onClick={this.toggle}>{this.props.payment.payment_type}</td>
            <td className="text-center" onClick={this.toggle}>{this.props.payment.date}</td>
            <td className="text-center" onClick={this.toggle}>{this.props.payment.value}</td>
            <td className="text-center" onClick={this.toggle}>{this.props.payment.description}</td>
            <td className="text-center">
              <button className="btn btn-sm btn-outline-success" onClick={this.toggleModal}>Оплатити</button>
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
          {/*<Collapse tag="tr" isOpen={this.state.isOpen}>*/}
          {/*  <td colSpan={4}>*/}
          {/*    <TransitionGroup {...this.groupProps}>*/}
          {/*      /!**/}
          {/*       // @ts-ignore*!/*/}
          {/*      {this.props.payment.payment_service.map((service) => (*/}
          {/*        <Flip top opposite cascade collapse when={this.state.isOpen}*/}
          {/*              spy={this.state.isOpen}>*/}
          {/*          <ListGroup>*/}
          {/*            <ListGroupItem style={{ border: 'none' }}*/}
          {/*                           className="justify-content-between">{service.service}*/}
          {/*              <Badge color={'success'} pill className="ml-4">{service.value}</Badge>*/}
          {/*            </ListGroupItem>*/}
          {/*          </ListGroup>*/}
          {/*        </Flip>*/}
          {/*      ))}*/}
          {/*    </TransitionGroup>*/}
          {/*  </td>*/}
          {/*</Collapse>*/}
        </>
      );
    }
  }
}