/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';

export default class MultiplePermissionComponent extends React.Component {

  getPermissionsByModelName = (name) => {
    return this.props.aclList[name];
  };

  isHavePermission = (list, permissionName) => {
    return list.includes(permissionName);
  };

  checkPermission(modelNames, permissionNames) {
    for (let i = 0; i < modelNames.length; i++) {
      const permsList = this.getPermissionsByModelName(modelNames[i]);
      if (permsList) {
        return this.isHavePermission(permsList, permissionNames[i]);
      }
    }
  }

  render() {
    return (
      <>
        {this.props.aclList && this.checkPermission(this.props.modelName, this.props.permissionName) ?
          this.props.children : ''
        }
      </>
    );
  }
}