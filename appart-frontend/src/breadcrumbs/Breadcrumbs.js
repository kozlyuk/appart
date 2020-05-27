import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { Link } from 'react-router-dom';

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
export default withBreadcrumbs()(Breadcrumbs);