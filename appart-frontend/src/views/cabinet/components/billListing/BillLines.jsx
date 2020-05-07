/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';

export default class BillLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }


  render() {
    return (
      <>
        <tr style={{ cursor: 'pointer' }}>
          <td>{this.props.item.number}</td>
          <td className="text-center">{this.props.item.period}</td>
          <td className="text-center">{this.props.item.total_value}</td>
        </tr>
      </>
    );
  }
}