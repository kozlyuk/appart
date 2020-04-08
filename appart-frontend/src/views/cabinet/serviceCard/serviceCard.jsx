/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, {Fragment} from 'react';
import {Text} from 'react-easy-i18n';
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
    const {isOpen} = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

  render() {
    if (this.props.service) {
      this.pk = this.props.service.pk;
      this.apartment = this.props.service.apartment;
      this.work = this.props.service.apartment;
      this.number = this.props.service.number;
      this.execStatus = this.props.service.exec_status;
      this.payStatus = this.props.service.pay_status;
      this.information = this.props.service.information;
      this.warning = this.props.service.warning;
      this.createdBy = this.props.service.created_by;
      this.dateCreated = this.props.service.date_created;
      this.dateUpdated = this.props.service.date_updated;
      this.dateClosed = this.props.service.date_closed;
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
          <tr style={{cursor: 'pointer'}} onClick={this.toggle}>
            <td>
              {this.props.service.apartment}
            </td>
            <td className="text-center">
              {this.work}
            </td>
            <td className="text-center">
              {this.number}
            </td>
            <td className="text-center">
              {this.execStatus}
            </td>
            <td className="text-center">
              {this.payStatus}
            </td>
            <td className="text-center">
              {this.information}
            </td>
            <td className="text-center">
              {this.warning}
            </td>
          </tr>
          {/*<Collapse tag="tr" isOpen={isOpen}>*/}
          {/*  <td colSpan={4}>*/}
          {/*    <TransitionGroup {...this.groupProps}>*/}
          {/*      /!**/}
          {/*       // @ts-ignore*!/*/}
          {/*      {this.paymentService.map((item) => (*/}
          {/*        <Flip key={'2'} top opposite cascade collapse when={isOpen} spy={isOpen}>*/}
          {/*          <ListGroup>*/}
          {/*            <ListGroupItem style={{border: 'none'}} className="justify-content-between">{item.service}*/}
          {/*              <Badge color={'success'} pill className="ml-4">{item.value}</Badge>*/}
          {/*            </ListGroupItem>*/}
          {/*          </ListGroup>*/}
          {/*        </Flip>*/}
          {/*      ))}*/}
          {/*    </TransitionGroup>*/}
          {/*  </td>*/}
          {/*</Collapse>*/}
        </Fragment>
      );
    }
  }
}