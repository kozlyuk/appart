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
import styles from './tableStyle.module.css';

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
          <ReactToPrint
            copyStyles={true}
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
        {bills?.map((item, index) => (
          <table style={index % 5 === 0 ? { pageBreakBefore: 'always' } : {}}
                 className={'table table-sm ' + styles.tableBorder}>
            <thead>
            <tr className={styles.border}>
              <th className={styles.border} scope="col"><small>{company.name}</small></th>
              <th scope="col" className={'text-center ' + styles.border} colSpan={10}><small>
                Рахунок № {item.number} на оплату комунальних послуг за {item.local_period}
              </small></th>
            </tr>
            <tr className={styles.border}>
              <th className={styles.border}><small>{company.address}</small></th>
              <th className={styles.border} colSpan={5}><small>{item.resident_name}</small></th>
              <th className={styles.border} colSpan={5}><small>Особовий
                рахунок: {item.apartment_account_number}</small></th>
            </tr>
            <tr>
              <th className={styles.border}>
                <small>{company.bank_requisites}</small>
              </th>
              <th className={styles.border} colSpan={5}><small>Адреса: {item.house_address}</small></th>
              <th className={styles.border} colSpan={5}><small>Площа
                Загальна: {item.apartment_area} м2</small></th>
            </tr>
            </thead>
            <tbody>
            <tr className={styles.border}>
              <th className={'text-center ' + styles.border} rowSpan={2}><small>Вид послуг</small>
              </th>
              <th rowSpan={2} className={'text-center ' + styles.border}><small>Борг на поч.
                місяця,
                грн.</small></th>
              <th rowSpan={2} className={'text-center ' + styles.border}><small>Оплачено,
                грн</small>
              </th>
              <th rowSpan={2} className={'text-center ' + styles.border}><small>Субсидія/Пільга,
                грн</small></th>
              <th colSpan={3} className={'text-center ' + styles.border}><small>Показники
                лічильника</small></th>
              <th rowSpan={2} className={'text-center ' + styles.border}><small>Тариф, грн</small>
              </th>
              <th rowSpan={2} className={'text-center ' + styles.border}><small>Нараховано,
                грн</small></th>
              <th rowSpan={2} colSpan={2} className={'text-center border-3 ' + styles.border}>
                <small>Сума
                  до
                  оплати, грн</small></th>
            </tr>
            <tr>
              <th className={'text-center ' + styles.border}><small>Останній</small></th>
              <th className={'text-center ' + styles.border}><small>Попередній</small></th>
              <th className={'text-center ' + styles.border}><small>Різниця</small></th>
            </tr>
            {item.bill_lines.map(billLine => (
              <tr className={styles.border}>
                <th className={styles.border}><small>{billLine.service_name}</small></th>
                <th className={'text-center ' + styles.border}>
                  <small>{billLine.previous_debt}</small></th>
                <th className={'text-center ' + styles.border}><small>-</small></th>
                <th className={'text-center ' + styles.border}>
                  <small>{billLine.exemption_value}</small></th>
                <th className={'text-center ' + styles.border}><small>-</small></th>
                <th className={'text-center ' + styles.border}><small>-</small></th>
                <th className={'text-center ' + styles.border}><small>-</small></th>
                <th className={'text-center ' + styles.border}><small>{billLine.rate}</small></th>
                <th className={'text-center ' + styles.border}><small>{billLine.value}</small></th>
                <th colSpan="2" className={'text-center ' + styles.border}>
                  <small>{billLine.total_debt}</small></th>
              </tr>
            ))}
            <tr>
              <th colSpan={8} className={'text-right ' + styles.border}>
                <small>Рекомендована сума до оплати:</small>
              </th>
              <th colSpan={3} className={'text-right ' + styles.border}>
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
