/*
 * Payment list component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import Auth from '../../auth/auth';
import axios from 'axios';
import {Col, Row} from 'reactstrap';
// @ts-ignore
import {Text} from 'react-easy-i18n';
import ServiceCard from "./serviceCard/serviceCard";

/**
 * Props interface
 */
interface ServiceListPropsInterface {
  user: any,
}

export default class ServiceList extends React.Component<ServiceListPropsInterface, {}> {

  /**
   * User object
   */
  private user: Auth;

  /**
   * Constructor
   *
   * @param props
   * @param context
   */
  constructor(props: ServiceListPropsInterface, context: any) {
    super(props, context);
    this.state = {
      isLoaded: false,
      data: null
    };
    this.user = new Auth();
  }

  componentDidMount(): void {
    if (this.props.user) {
      const {apartment_set} = this.props.user;
      axios(`${process.env.REACT_APP_SERVICES}`, {
        headers: {
          'Authorization': 'Token ' + this.user.getAuthToken()
        }
      })
        .then(
          result => {
            this.setState({
              isLoaded: true,
              data: result.data.results,
              paginationCount: result.data.count,
              paginationNext: result.data.next,
              paginationPrevious: result.data.previous
            });
          },
          error => {
            this.setState({
              isLoaded: true
            });
          }
        );
    }
  }

  render() {
    const {isLoaded}: any = this.state;
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
        <Row>
          <Col sm="12">
            <table className="table bg-white">
              <thead>
              <tr>
                <th scope="col">
                  Тип оплати
                </th>
                <th className="text-center" scope="col">
                  Період
                </th>
                <th className="text-center" scope="col">
                  Сума
                </th>
                <th className="text-center" scope="col">
                  Опис
                </th>
              </tr>
              </thead>
              <tbody>
              {/*
							// @ts-ignore*/}
              {this.state.data.map((item) => (
                <ServiceCard key={item.toString()} isLoaded={isLoaded} service={item}/>
              ))}
              </tbody>
            </table>
          </Col>
        </Row>
      );
    }
  }
}

