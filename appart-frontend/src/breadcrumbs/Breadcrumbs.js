import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Link } from 'react-router-dom';
import { Text } from 'react-easy-i18n';

const BreadcrumbsHome = () => (<Text text="sidebar.home" formatters="firstUppercase"/>);
const BreadcrumbsUser = () => (<Text text="sidebar.user" formatters="firstUppercase"/>);
const BreadcrumbsBill = () => (<Text text="sidebar.bills" formatters="firstUppercase"/>);
const BreadcrumbsPayment = () => (<Text text="sidebar.payment" formatters="firstUppercase"/>);
const BreadcrumbsHouse = () => (<Text text="sidebar.house" formatters="firstUppercase"/>);
const BreadcrumbsApartment = () => (<Text text="sidebar.apartment" formatters="firstUppercase"/>);
const BreadcrumbsOrder = () => (<Text text="sidebar.order" formatters="firstUppercase"/>);
const BreadcrumbsWork = () => (<Text text="sidebar.work" formatters="firstUppercase"/>);
const BreadcrumbsNew = () => (<Text text="breadcrumbsItems.new" formatters="firstUppercase"/>);
const BreadcrumbsEdit = () => (<Text text="breadcrumbsItems.edit" formatters="firstUppercase"/>);

const routes = [
  { path: '/' },
  { path: '/dashboard/', breadcrumb: BreadcrumbsHome },
  { path: '/dashboard/user', breadcrumb: BreadcrumbsUser },
  { path: '/dashboard/user/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/user/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/bill', breadcrumb: BreadcrumbsBill },
  { path: '/dashboard/bill/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/bill/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/payment', breadcrumb: BreadcrumbsPayment },
  { path: '/dashboard/payment/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/payment/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/house', breadcrumb: BreadcrumbsHouse },
  { path: '/dashboard/house/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/house/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/apartment', breadcrumb: BreadcrumbsApartment },
  { path: '/dashboard/apartment/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/apartment/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/order', breadcrumb: BreadcrumbsOrder },
  { path: '/dashboard/order/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/order/new', breadcrumb: BreadcrumbsNew },
  { path: '/dashboard/work', breadcrumb: BreadcrumbsWork },
  { path: '/dashboard/work/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/dashboard/work/new', breadcrumb: BreadcrumbsNew }
];


/**
 * Breadcrumbs hoc for dashboard
 *
 * @param breadcrumbs
 * @return {*}
 * @constructor
 */
const Breadcrumbs = ({ breadcrumbs }) => (
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
export default withBreadcrumbs(routes, { excludePaths: ['/', '/no-breadcrumb/for-this-route'] })(Breadcrumbs);