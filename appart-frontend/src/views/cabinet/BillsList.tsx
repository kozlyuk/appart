/*
 * Bills list component
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import {Col, Row} from 'reactstrap';
import axios from 'axios';
import Auth from '../../auth/auth';
// @ts-ignore
import {Text} from 'react-easy-i18n';
import BillCard from './billCard/BillCard';

/**
 * Props interface
 */
interface BillsListPropsInterface {
  user: any;
}

/**
 * Bills list object
 */
export default class BillsList extends React.Component<BillsListPropsInterface, {}> {

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
  constructor(props: BillsListPropsInterface, context: any) {
    super(props, context);
    this.state = {
      isLoaded: false,
      data: null
    };
    this.user = new Auth();
  }

// ToDo: need check for user have apartment
// ToDo: add error if user have no payments and bills
  /**
   * Get data before render
   *
   */
  componentDidMount() {
    if (this.props.user) {
      const {apartment_set} = this.props.user;
      axios(`${process.env.REACT_APP_GET_BILLS}${apartment_set[0]}/`, {
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
                  Номер рахунку
                </th>
                <th className="text-center" scope="col">
                  Виписаний
                </th>
                <th className="text-center" scope="col">
                  Сума
                </th>
                <th className="text-center" scope="col">
                  Дії
                </th>
              </tr>
              </thead>
              <tbody>
              {/*
							// @ts-ignore*/}
              {this.state.data.map((item) => (
                <BillCard key={item.number.toString()} bill={item}/>
              ))}
              </tbody>
            </table>
          </Col>
        </Row>
      );
    }
  }
}