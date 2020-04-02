/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, {Fragment} from 'react';
import {Text} from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Flip from 'react-reveal/Flip';
import {Badge, Collapse, ListGroup, ListGroupItem} from 'reactstrap';

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
    if (this.props.payment) {
      this.paymentType = this.props.payment.payment_type.toString();
      this.action = this.props.payment.action.toString();
      this.date = this.props.payment.date.toString();
      this.value = this.props.payment.value;
      this.description = this.props.payment.description.toString();
      this.paymentService = this.props.payment.payment_service;
    }
    const {isOpen} = this.state;
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
              {this.paymentType}
            </td>
            <td className="text-center">
              {this.date}
            </td>
            <td className="text-center">
              {this.value}
            </td>
            <td className="text-center">
              {this.description}
            </td>
          </tr>
          <Collapse tag="tr" isOpen={isOpen}>
            <td colSpan={4}>
              <TransitionGroup {...this.groupProps}>
                {/*
                 // @ts-ignore*/}
                {this.paymentService.map((item) => (
                  <Flip key={'2'} top opposite cascade collapse when={isOpen} spy={isOpen}>
                    <ListGroup>
                      <ListGroupItem style={{border: 'none'}} className="justify-content-between">{item.service}
                        <Badge color={'success'} pill className="ml-4">{item.value}</Badge>
                      </ListGroupItem>
                    </ListGroup>
                  </Flip>
                ))}
              </TransitionGroup>
            </td>
          </Collapse>
        </Fragment>
      );
    }
  }
}