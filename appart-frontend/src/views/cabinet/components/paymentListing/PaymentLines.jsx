/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { Badge, Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import Flip from 'react-reveal/Flip';
import { TransitionGroup } from 'react-transition-group';

export default class PaymentLines extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  /**
   * Collapse toggler
   */
  toggle = () => {
    const { isOpen } = this.state;
    if (this.props.item.payment_service[0]) {
      this.setState({
        isOpen: !isOpen
      });
    }
  };

  render() {
    return (
      <>
        <tr style={{ cursor: 'pointer' }} onClick={this.toggle}>
          <td>{this.props.item.payment_type}</td>
          <td className="text-center">{this.props.item.date}</td>
          <td className="text-center">{this.props.item.value}</td>
          <td className="text-center">{this.props.item.description}</td>
        </tr>
        <Collapse tag="tr" isOpen={this.state.isOpen}>
          <td colSpan={4}>
            <TransitionGroup {...this.groupProps}>
              {/*
               // @ts-ignore*/}
              {this.props.item.payment_service.map((service) => (
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