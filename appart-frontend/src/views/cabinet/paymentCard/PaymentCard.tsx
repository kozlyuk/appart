/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Fragment } from 'react';
import Collapse from 'reactstrap/lib/Collapse';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import PageSpinner from '../../../components/PageSpinner';
// @ts-ignore
import TransitionGroup from 'react-transition-group/TransitionGroup';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';


interface PaymentCardInterface {
  isLoaded: boolean,
  payment: {
    payment_type: string,
    action: string,
    apartment: number,
    date: number,
    description: string,
    payment_service: [],
    value: number
  },
}

export default class PaymentCard extends React.Component<PaymentCardInterface, {}> {
  constructor(props: PaymentCardInterface, state: any) {
    super(props, state);
    this.state = {
      isOpen: false
    };
    this.groupProps = {
      appear: true,
      enter: true,
      exit: true
    };
  }

  private readonly groupProps: { appear: boolean; exit: boolean; enter: boolean };

  toggle = () => {
    const { isOpen }: any = this.state;
    this.setState({
      isOpen: !isOpen
    });
  };

  protected paymentType: string | undefined;

  protected action: string | undefined;

  protected date: string | undefined;

  protected value: number | undefined;

  protected description: string | undefined;

  protected paymentService: Array<string> | undefined;

  render() {
    if (this.props.payment) {
      this.paymentType = this.props.payment.payment_type.toString();
      this.action = this.props.payment.action.toString();
      this.date = this.props.payment.date.toString();
      this.value = this.props.payment.value;
      this.description = this.props.payment.description.toString();
      this.paymentService = this.props.payment.payment_service;
      console.log(this.paymentService);
    }
    const { isOpen }: any = this.state;
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
                <Fade key={'2'} top opposite cascade collapse when={isOpen}>
                  {/*
							    // @ts-ignore*/}
                  {this.paymentService.map((item: any) => (
                    <ListGroup>
                      <ListGroupItem style={{ border: 'none' }} className="justify-content-between">{item.service}
                        <Badge color={'success'} pill className="ml-4">{item.value}</Badge>
                      </ListGroupItem>
                    </ListGroup>
                  ))}
                </Fade>
              </TransitionGroup>
            </td>
          </Collapse>
        </Fragment>
      );
    }
  }
}