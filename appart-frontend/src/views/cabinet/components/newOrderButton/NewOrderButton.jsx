/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { Text } from 'react-easy-i18n';

export default class NewOrderButton extends React.Component {
  render() {
    return (
      <div className="container col-12 ">
        <div className="startsection py-3 mx-4 my-1">
          <Link to="/cabinet/order/new">
            <button type="submit"
                    className="btn btn-success btn-order shadow-sm m-2 justify-content-start"><MdAdd
              size="1.2em"/><Text text='cabinet.orderCard.createOrder'/>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}