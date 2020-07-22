/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';

export default class PermissionComponent extends React.Component {

  isHavePermission = (list, permissionName) => {
    return list.includes(permissionName);
  };

  checkPermission(permissionName) {
    const permsList = this.props.aclList;
    if (permsList) {
      return this.isHavePermission(permsList, permissionName);
    } else {
      return false;
    }
  }

  render() {
    return (
      <>
        {this.props.aclList && this.checkPermission(this.props.permissionName) ?
          this.props.children : ''
        }
      </>
    );
  }
}