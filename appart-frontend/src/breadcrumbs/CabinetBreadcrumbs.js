/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Link } from 'react-router-dom';

/**
 * Routes for cabinet breadcrumbs
 *
 * @type {{path: string, breadcrumb: string}[]}
 */
const routes = [
  { path: '/' },
  { path: '/cabinet', breadcrumb: 'Домівка' },
  { path: '/cabinet/service', breadcrumb: 'Сервісна служба' },
  { path: '/cabinet/payments', breadcrumb: 'Рахунки' },
  { path: '/cabinet/bills', breadcrumb: 'Оплати' },
  { path: '/cabinet/order', breadcrumb: 'Сервісна служба' },
  { path: '/cabinet/order/new', breadcrumb: 'Нове замовлення' }
];

const options = {
  excludePaths: ['/', '/no-breadcrumb/for-this-route']
};


/**
 * Breadcrumbs hoc for cabinet
 *
 * @param breadcrumbs
 * @return {*}
 * @constructor
 */
const CabinetBreadcrumbs = ({ breadcrumbs }) => (
  <nav aria-label="breadcrumb">
    <ol style={{
      backgroundColor: 'transparent',
      marginBottom: '0px'
    }} className="breadcrumb">
      {breadcrumbs.map(({ match, breadcrumb }) => (
        <li key={match.url} className="breadcrumb-item">
          <Link to={match.url} className="text-muted">{breadcrumb}</Link>
        </li>
      ))}
    </ol>
  </nav>
);

// export default withBreadcrumbs(routes)(Breadcrumbs);
export default withBreadcrumbs(routes, { excludePaths: ['/', '/no-breadcrumb/for-this-route'] })(CabinetBreadcrumbs);