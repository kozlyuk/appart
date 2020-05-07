/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Badge, Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import { TransitionGroup } from 'react-transition-group';
import { Flip } from 'react-reveal';
import { UserConsumer } from '../../../../globalContext/userContext';
import { Text } from 'react-easy-i18n';

export default class PaymentLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isLoaded: true
    };

  }


  /**
   * Collapse toggler
   */
  toggle = () => {
    const { isOpen } = this.state;
    if (this.props.payment.payment_service[0]) {
      this.setState({
        isOpen: !isOpen
      });
    }
  };

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType = UserConsumer;


  render() {
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
        <>
          <tr style={{ cursor: 'pointer' }} onClick={this.toggle}>
            <td>{this.props.payment.payment_type}</td>
            <td className="text-center">{this.props.payment.date}</td>
            <td className="text-center">{this.props.payment.value}</td>
            <td className="text-center">{this.props.payment.description}</td>
          </tr>
          <Collapse tag="tr" isOpen={this.state.isOpen}>
            <td colSpan={4}>
              <TransitionGroup {...this.groupProps}>
                {/*
                 // @ts-ignore*/}
                {this.props.payment.payment_service.map((service) => (
                  <Flip top opposite cascade collapse when={this.state.isOpen}
                        spy={this.state.isOpen}>
                    <ListGroup>
                      <ListGroupItem style={{ border: 'none' }}
                                     className="justify-content-between">{service.service}
                        <Badge color={'success'} pill className="ml-4">{service.value}</Badge>
                      </ListGroupItem>
                    </ListGroup>
                  </Flip>
                ))}
              </TransitionGroup>
            </td>
          </Collapse>
        </>
      );
    }
  }
}