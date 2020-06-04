/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Link } from 'react-router-dom';
import { Text } from 'react-easy-i18n';

const CabinetBreadcrumbsHome = () => (<Text text="cabinetBreadcrumbs.home" formatters="firstUppercase"/>);
const CabinetBreadcrumbsService = () => (<Text text="cabinetBreadcrumbs.service" formatters="firstUppercase"/>);
const CabinetBreadcrumbsPayments = () => (<Text text="cabinetBreadcrumbs.payments" formatters="firstUppercase"/>);
const CabinetBreadcrumbsBills = () => (<Text text="cabinetBreadcrumbs.bills" formatters="firstUppercase"/>);
const CabinetBreadcrumbsNewOrder = () => (<Text text="cabinetBreadcrumbs.orderNew" formatters="firstUppercase"/>);

/**
 * Routes for cabinet breadcrumbs
 *
 * @type {{path: string, breadcrumb: string}[]}
 */
const routes = [
  { path: '/' },
  { path: '/cabinet', breadcrumb: CabinetBreadcrumbsHome },
  { path: '/cabinet/service', breadcrumb: CabinetBreadcrumbsService },
  { path: '/cabinet/payments', breadcrumb: CabinetBreadcrumbsPayments },
  { path: '/cabinet/bills', breadcrumb: CabinetBreadcrumbsBills },
  { path: '/cabinet/order', breadcrumb: CabinetBreadcrumbsService },
  { path: '/cabinet/order/new', breadcrumb: CabinetBreadcrumbsNewOrder }
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