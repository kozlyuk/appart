import React from 'react';
import { Route } from 'react-router-dom';
import PermissionChecker from '../../acl/PermissionRoute';

const LayoutRoute = ({ component: Component, layout: Layout, modelName: ModelName, permissionName: PermissionName, ...rest }) => (
  <PermissionChecker modelName={ModelName} permissionName={PermissionName}>
    <Route
      {...rest}
      render={props => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    />
  </PermissionChecker>
);

export default LayoutRoute;
