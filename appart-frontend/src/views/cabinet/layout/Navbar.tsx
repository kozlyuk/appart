/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Auth from '../../../auth/auth';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import CabinetBreadcrumbs from '../../../breadcrumbs/CabinetBreadcrumbs';
import { LangContext } from '../../../globalContext/langContext';
import { UserContext } from '../../../globalContext/userContext';

export default class Navbar extends Component<any, any> {

  private user: Auth;

  constructor(props: any) {
    super(props);
    this.user = new Auth();
  }

  state = {
    data: null,
    isLoaded: true,
    tooltipOpen1: false,
    tooltipOpen2: false
  };

  toggleTooltip1 = () => {
    const tooltipOpen1 = this.state;
    this.setState({
      tooltipOpen1: !tooltipOpen1
    });
  };

  toggleTooltip2 = () => {
    const tooltipOpen2 = this.state;
    this.setState({
      tooltipOpen2: !tooltipOpen2
    });
  };

  static contextType = LangContext;

  render() {
    const userCardToggleClass = (this.props.isCardToggled ?
      'dropdown-menu dropdown-menu-right align-self-center show'
      : 'dropdown-menu dropdown-menu-right align-self-center');
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          {/*
           // @ts-ignore*/}
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <nav className="navbar navbar-expand-md navbar-light mb-3 bg-white shadow-sm ">
          <button onClick={this.props.toggle} type="button" className="navbar-toggler d-block button-header "
                  data-toggle="collapse" ref="#collapseMenu" role="button" aria-expanded="false"
                  aria-controls="collapseMenu" aria-label="Menu">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="d-none d-md-block mr-auto ">
            <CabinetBreadcrumbs/>
          </div>
          <div className="navbar-nav nav-tabs col-md pr-0 text-center  ">
            <div>
              <p/>
            </div>
            <UserContext.Consumer>
              {({ apartment }: any) => (
                <div className=" alert alert-success align-self-center p-1 mb-0 mx-auto" role="alert">
                  <Text text="cabinet.debt"/>: {apartment[0].debt}
                </div>
              )}
            </UserContext.Consumer>
            <ul className="navbar-nav">
              <li className="nav-item  align-self-center ">
                <a href={process.env.REACT_APP_HOUSE_URL} className="nav-link"><Text text="cabinet.house"/></a>
              </li>
              <li className="nav-item   align-self-center ">
                <a href={process.env.REACT_APP_COMPANY_URL} className="nav-link"><Text text="cabinet.company"/></a>
              </li>
              <li className="dropdown nav-item my-auto " style={{ maxWidth: '70px' }}>
                <button onClick={this.props.toggleUserCard} className="btn dropdown-toggle " ref="#" role="button"
                        id="dropdownMenuLink"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <MdAccountCircle size="1.5em"/>
                </button>
                <div className={userCardToggleClass}
                     aria-labelledby="dropdownMenuLink" style={{ width: '250px' }}>
                  <div
                    className="d-flex justify-content-center align-items-center flex-column card-body">
                    <img src="https://dimonline.pp.ua/static/media/100_4.978e51b5.jpg"
                         className="rounded-circle mb-2" style={{ width: '80px', height: '80px' }} alt='user avatar'/>
                    <div className="card-title">{this.props.userFirstName} {this.props.userLastName}</div>
                    <div className="card-subtitle">{this.props.userEmail}</div>
                  </div>
                  <Link className="dropdown-item" to="/dashboard/">
                    <Text text="cabinet.userCard.administration"/>
                  </Link>
                  <a style={{ cursor: 'pointer' }} className="dropdown-item"
                     onClick={() => this.context('en', 'noReload')}>
                    English version
                  </a>
                  <a style={{ cursor: 'pointer' }} className="dropdown-item"
                     onClick={() => this.context('uk', 'noReload')}>
                    Українська версія
                  </a>
                  <a className="dropdown-item disabled">
                    <del><Text text="cabinet.userCard.profile"/></del>
                  </a>
                  <a className="dropdown-item disabled">
                    <del><Text text="cabinet.userCard.cabinet"/></del>
                  </a>
                  <div className="dropdown-divider"/>
                  <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => {
                    this.user.logout();
                  }}><Text text="cabinet.userCard.logOut"/></a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      );
    }
  }
}