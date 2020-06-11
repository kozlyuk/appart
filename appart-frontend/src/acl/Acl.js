/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import React from 'react';
import axios from 'axios';
import Auth from '../auth/auth';
import { PermissionContext } from '../globalContext/PermissionContext';

export default class Acl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: {},
      isAclLoad: false
    };
    this.user = new Auth();
  }

  getPermission = () => {
    axios({
      method: 'get',
      url: process.env.REACT_APP_GET_ACL,
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    })
      .then((response) => {
        this.setPermission(response.data);
        this.setState({
          isAclLoad: true
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  setPermission(list) {
    this.setState({
      permissions: list
    });
  }

  getPermissionList() {
    return this.state.permissions;
  }

  checkPermission(modelName, permission) {
    console.log(this.state.permissions);
  }

  componentDidMount() {
    this.getPermission();
  }

  render() {
    return (
      <>
        <PermissionContext.Provider value={this.state.permissions}>
          {this.props.children}
        </PermissionContext.Provider>
      </>
    );
  }
}