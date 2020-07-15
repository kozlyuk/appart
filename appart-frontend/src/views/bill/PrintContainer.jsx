/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import axios from 'axios';
import Auth from '../../auth/auth';
import PageSpinner from '../../components/PageSpinner';
import { Button } from 'reactstrap';
import { MdPrint } from 'react-icons/md';

export default class PrintContainer extends React.Component {

  constructor(props) {
    super(props);
    this._user = new Auth();
  }

  state = {
    data: null,
    isLoaded: false
  };

  componentDidMount() {
    axios(process.env.REACT_APP_COMPANY, {
      method: 'get',
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(response => {
        this.setState({
          data: response.data,
          isLoaded: true
        });
      });
  }

  render() {
    const data = this.props.data;
    if (this.state.isLoaded) {
      return (
        <>
          <ReactToPrint pageStyle='.borderRight {border-right: 3px solid black}' copyStyles
                        content={() => this.componentRef}>
            <PrintContextConsumer>
              {({ handlePrint }) => (
                <div className="text-center mb-2">
                  <Button onClick={handlePrint} color="primary"><MdPrint/> Друкувати</Button>
                </div>
              )}
            </PrintContextConsumer>
          </ReactToPrint>
          <Receipt bill={data} company={this.state.data[0]} ref={el => (this.componentRef = el)}/>
        </>
      );
    } else {
      return (
        <PageSpinner/>
      );
    }
  }
}

class Receipt extends React.Component {
  render() {
    const bills = this.props.bill;
    const company = this.props.company;
    return (
      <div>
        {bills?.map(item => (
          <table style={{ border: '3px solid black' }} className="table table-bordered table-hover table-sm">
            <thead>
            <tr>
              <th scope="col"><small>{company.name}</small></th>
              <th scope="col" className="text-center" colSpan={10}><small>
                Рахунок № {item.number} на оплату комунальних послуг за {item.local_period}
              </small></th>
            </tr>
            <tr>
              <th><small>{company.address}</small></th>
              <th colSpan={5}><small>{item.resident_name}</small></th>
              <th colSpan={5}><small>Особовий рахунок: {item.apartment_account_number}</small></th>
            </tr>
            <tr>
              <th>
                <small>{company.bank_requisites}</small>
              </th>
              <th colSpan={5}><small>Адреса: {item.house_address}</small></th>
              <th colSpan={5}><small>Площа Загальна: {item.apartment_area} м2</small></th>
            </tr>
            </thead>
            <tbody>
            <tr style={{ borderRight: '3px solid black' }}>
              <th rowSpan={2} className="text-center"><small>Вид послуг</small></th>
              <th rowSpan={2} className="text-center"><small>Борг на поч. місяця, грн.</small></th>
              <th rowSpan={2} className="text-center"><small>Оплачено, грн</small></th>
              <th rowSpan={2} className="text-center"><small>Субсидія/Пільга, грн</small></th>
              <th colSpan={3} className="text-center"><small>Показники лічильника</small></th>
              <th rowSpan={2} className="text-center"><small>Тариф, грн</small></th>
              <th rowSpan={2} className="text-center"><small>Нараховано, грн</small></th>
              <th style={{ borderRight: '3px solid black' }} rowSpan={2} className="text-center borderRight"><small>Сума
                до
                оплати, грн</small></th>
            </tr>
            <tr>
              <th className="text-center"><small>Останній</small></th>
              <th className="text-center"><small>Попередній</small></th>
              <th className="text-center"><small>Різниця</small></th>
            </tr>
            {item.bill_lines.map(billLine => (
              <tr style={{ borderRight: '3px solid black' }}>
                <th><small>{billLine.service_name}</small></th>
                <th className="text-center"><small>{billLine.previous_debt}</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>{billLine.exemption_value}</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>{billLine.rate}</small></th>
                <th className="text-center"><small>{billLine.value}</small></th>
                <th style={{ borderRight: '3px solid black' }} className="text-center borderRight">
                  <small>{billLine.total_debt}</small></th>
              </tr>
            ))}
            <tr>
              <th colSpan={8} className="text-right">
                <small>Рекомендована сума до оплати:</small>
              </th>
              <th style={{ borderRight: '3px solid black' }} colSpan={2} className="text-right">
                <small>{item.total_value}</small>
              </th>
            </tr>
            </tbody>
          </table>
        ))}
      </div>
    );
  }
}
