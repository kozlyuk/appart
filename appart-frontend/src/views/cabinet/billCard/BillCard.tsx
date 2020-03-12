/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import Collapse from 'reactstrap/lib/Collapse';

/**
 * Props interface
 */
interface BillCardPropsInterface {
  bill: {
    number: string;
    period: string;
    total_value: number;
    bill_lines: any | undefined;
  }
}

export default class BillCard extends React.Component <BillCardPropsInterface, {}> {
  constructor(props: BillCardPropsInterface, state: any) {
    super(props, state);
    this.state = {
      isOpen: false
    };

  }

  toggle = () => {
    const { isOpen }: any = this.state;
    this.setState({
      isOpen: !isOpen
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
    return (
      <Fragment>
        <tr style={{ cursor: 'pointer' }} onClick={this.toggle} key={this.billNumber}>
          <td>
            {this.billNumber}
          </td>
          <td className="text-center">
            {this.billPeriod}
          </td>
          <td className="text-center">
            {this.billTotalValue}
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
      </Fragment>
    );
  }
}
