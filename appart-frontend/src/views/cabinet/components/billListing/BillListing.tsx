/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import axios from 'axios';
import Auth from '../../../../auth/auth';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import BillLines from './BillLines';
import { UserContext } from '../../../../globalContext/userContext';

export default class BillListing extends Component {

  private user: Auth;

  /**
   * Bill listing constructor
   *
   * @param props
   */
  constructor(props: any) {
    super(props);
    this.user = new Auth();
  }

  state = {
    isLoaded: false,
    isOpen: false,
    data: null,
    paginationCount: '',
    paginationNext: '',
    paginationPrevious: ''
  };

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType = UserContext;

  componentDidMount() {
    if (this.context) {
      axios(`${process.env.REACT_APP_GET_BILLS}?apartment=${this.context.apartment[0].pk}`, {
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
    const { isLoaded } = this.state;
    const data: any = this.state.data;
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
        <div className="table-account shadow-sm py-2 px-4 ">
          <table className="table bg-white table-striped">
            <thead className="one">
            <tr className="">
              <th className="text-center" scope="col"><Text text="cabinet.billCard.billNumber"/></th>
              <th className="text-center" scope="col"><Text text="cabinet.billCard.billDate"/></th>
              <th className="text-center" scope="col"><Text text="cabinet.billCard.billValue"/></th>
              <th className="text-center" scope="col"><Text text="cabinet.billCard.actions"/></th>
            </tr>
            </thead>
            <tbody>
            {data?.map((item: any) => (
              <BillLines key={item.pk} item={item} isOpen={this.state.isOpen}/>
            ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}