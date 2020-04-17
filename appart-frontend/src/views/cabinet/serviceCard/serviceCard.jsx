/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import { Text } from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';

/**
 * Payment card class
 */
export default class ServiceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.groupProps = {
      appear: true,
      enter: true,
      exit: true
    };
  }

  /**
   * Collapse toggler
   */
  toggle = () => {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

  render() {
    if (this.props.service) {
      this.work_name = this.props.service.work_name;
      this.execStatus = this.props.service.exec_status;
      this.payStatus = this.props.service.pay_status;
      this.duration = this.props.service.duration;
    }
    if (!this.props.isLoaded) {
      return (
        <td colSpan={4} className="loaderWrapper text-center mt-4 ml-auto mr-auto">
          <PageSpinner/>
          {/*
           // @ts-ignore*/}
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </td>)
        ;
    } else {
      return (
        <Fragment>
          <tr style={{ cursor: 'pointer' }} onClick={this.toggle}>
            <td>
              {this.work_name}
            </td>
            <td className="text-center">
              {this.execStatus}
            </td>
            <td className="text-center">
              {this.payStatus}
            </td>
          </tr>
        </Fragment>
      );
    }
  }
}