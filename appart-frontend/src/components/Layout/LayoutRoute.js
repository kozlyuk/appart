import React from 'react';
import { Route } from 'react-router-dom';

const LayoutRoute = ({ component: Component, layout: Layout, modelName: ModelName, permissionName: PermissionName, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
);

export default LayoutRoute;
