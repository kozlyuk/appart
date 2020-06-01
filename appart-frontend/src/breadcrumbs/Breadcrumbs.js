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
  { path: '/', breadcrumb: BreadcrumbsHome },
  { path: '/user', breadcrumb: BreadcrumbsUser },
  { path: '/user/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/user/new', breadcrumb: BreadcrumbsNew },
  { path: '/bill', breadcrumb: BreadcrumbsBill },
  { path: '/bill/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/bill/new', breadcrumb: BreadcrumbsNew },
  { path: '/payment', breadcrumb: BreadcrumbsPayment },
  { path: '/payment/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/payment/new', breadcrumb: BreadcrumbsNew },
  { path: '/house', breadcrumb: BreadcrumbsHouse },
  { path: '/house/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/house/new', breadcrumb: BreadcrumbsNew },
  { path: '/apartment', breadcrumb: BreadcrumbsApartment },
  { path: '/apartment/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/apartment/new', breadcrumb: BreadcrumbsNew },
  { path: '/order', breadcrumb: BreadcrumbsOrder },
  { path: '/order/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/order/new', breadcrumb: BreadcrumbsNew },
  { path: '/work', breadcrumb: BreadcrumbsWork },
  { path: '/work/:id/edit', breadcrumb: BreadcrumbsEdit },
  { path: '/work/new', breadcrumb: BreadcrumbsNew }
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
export default withBreadcrumbs(routes)(Breadcrumbs);