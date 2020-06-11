/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Route } from 'react-router-dom';

export default class PermissionRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Get permission by model name.
   *
   * @param name
   * @return {*}
   */
  getPermissionsByModelName = (name) => {
    return this.props.aclList[name];
  };

  /**
   * Check is user have permission.
   *
   * @param list
   * @param permissionName
   * @return {boolean}
   */
  isHavePermission = (list, permissionName) => {
    return list.includes(permissionName);
  };

  /**
   * Check permission.
   *
   * @param modelName
   * @param permissionName
   * @return {boolean}
   */
  checkPermission(modelName, permissionName) {
    const permsList = this.getPermissionsByModelName(modelName);
    if (permsList) {
      return this.isHavePermission(permsList, permissionName);
    } else {
      return false;
    }
  }

  render() {
    return (
      <>
        {this.props.aclList && this.checkPermission(this.props.modelName, this.props.permissionName) ?
          <Route {...this.props}/> : ''}
      </>
    );
  }
}

const PermissionDenied = (props) => (
  <div>Доступ заборонено</div>
);