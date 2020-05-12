/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import React from 'react';
import axios from 'axios';
import Auth from '../../../../auth/auth';
import { Text } from 'react-easy-i18n';
import NewOrderButton from '../newOrderButton/NewOrderButton';
import { UserConsumer } from '../../../../globalContext/userContext';

export default class ServiceListing extends React.Component {
  /**
   * Service list constructor
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      paginationCount: '',
      paginationNext: '',
      paginationPrevious: ''
    };
    this.user = new Auth();
  }

  /**
   * User context consumer
   *
   * @type {React.Consumer<{}>}
   */
  static contextType = UserConsumer;

  componentDidMount() {
    if (this.context) {
      axios(`${process.env.REACT_APP_SERVICES}${this.context.apartment[0].pk}/`, {
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
    if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <>
          <NewOrderButton/>
          <div className="table-account shadow-sm py-2 px-4 ">
            <table className="table bg-white table-striped">
              <thead className="one">
              <tr className="">
                <th className="text-center" scope="col">Назва роботи</th>
                <th className="text-center" scope="col">Статус виконання</th>
                <th className="text-center" scope="col">Статус оплати</th>
                <th className="text-center" scope="col">Дата створення</th>
              </tr>
              </thead>
              <tbody>
              {this.state.data.map((item) => (
                <tr key={item.pk} style={{ cursor: 'pointer' }}>
                  <td>{item.work_name}</td>
                  <td className="text-center">{item.exec_status}</td>
                  <td className="text-center">{item.pay_status}</td>
                  <td className="text-center">{item.date_created}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </>
      );
    }
  }
}