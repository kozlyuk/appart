/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import axios from 'axios';
import Collapse from 'reactstrap/lib/Collapse';
import Auth from '../../../../auth/auth';

/**
 * Props interface
 *
 */
interface BillCardPropsInterface {
  bill: {
    pk: number;
    number: string;
    period: string;
    total_value: number;
    bill_lines: any | undefined;
  },
}

/**
 * Bill card class
 *
 * @interface {@link BillCardPropsInterface}
 */
export default class BillCard extends React.Component <BillCardPropsInterface, {}> {
  constructor(props: BillCardPropsInterface, state: any) {
    super(props, state);
    this.state = {
      liqPayData: null,
      liqPaySign: null,
      isOpen: false,
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: true
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  /**
   * Url for get api tokens
   */
  private urlApiToken: any = process.env.REACT_APP_GET_PAYMENTS_TOKEN;

  /**
   * User object
   */
  private user: Auth = new Auth();

  componentDidMount(): void {
    if (this.props.bill) {
      const { pk } = this.props.bill;
      axios(`${this.urlApiToken}/${pk}/`, {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
        }
      })
        .then(
          result => {
            const { signature }: any = result.data;
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
   * Toggle collapse block
   */
  toggle = () => {
    const { isOpen }: any = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

  /**
   * Modal toggler
   *
   * @returns {function(...[*]=)}
   */
  toggleModal() {
    const { liqPayData }: any = this.state;
    const { liqPaySign }: any = this.state;
    // @ts-ignore
    LiqPayCheckout.init({
      data: liqPayData,
      signature: liqPaySign,
      embedTo: '#liqpay_checkout',
      language: 'ru',
      mode: 'popup' // embed || popup
      // @ts-ignore
    }).on('liqpay.callback', function(data) {
      console.log(data.status);
      console.log(data);
      // @ts-ignore
    }).on('liqpay.ready', function(data) {
      // ready
      // @ts-ignore
    }).on('liqpay.close', function(data) {
      // close
    });
  };

  protected billNumber: string | undefined;

  protected billPeriod: string | undefined;

  protected billTotalValue: number | undefined;

  render() {
    if (this.props.bill) {
      this.billNumber = this.props.bill.number.toString();
      this.billPeriod = this.props.bill.number;
      this.billTotalValue = this.props.bill.total_value;
    }
    const { isOpen }: any = this.state;
    const { modal }: any = this.state;
    const { className }: any = this.props;
    return (
      <Fragment>
        <tr style={{ cursor: 'pointer' }} key={this.billNumber}>
          <td onClick={this.toggle}>
            {this.billNumber}
          </td>
          <td className="text-center" onClick={this.toggle}>
            {this.billPeriod}
          </td>
          <td className="text-center" onClick={this.toggle}>
            {this.billTotalValue}
          </td>
          <td className="text-center">
            <button className="btn btn-sm btn-outline-success" onClick={this.toggleModal}>Оплатити</button>
          </td>
        </tr>
        <Collapse tag="tr" isOpen={isOpen}>
          {/*{this.props.bill.bill_lines[0] &&*/}
          <td colSpan={3}>
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
          {/*}*/}
        </Collapse>
        <div id="liqpay_checkout"/>
      </Fragment>
    );
  }
}