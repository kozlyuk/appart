/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';

export default class Receipt extends React.Component {
  render() {
    const bills = this.props.bill;
    return (
      <>
        {bills?.map(item => (
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
            {item.bill_lines.map(billLine => (
              <tr>
                <th><small>{billLine.service}</small></th>
                <th className="text-center"><small>{billLine.previous_debt}</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>3.55</small></th>
                <th className="text-center"><small>{billLine.value}</small></th>
                <th className="text-center"><small>-</small></th>
                <th className="text-center"><small>{billLine.total_debt}</small></th>
              </tr>
            ))}
            </tbody>
          </table>
        ))}
      </>
    );
  }
}