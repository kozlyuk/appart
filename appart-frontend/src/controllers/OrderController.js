/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import axios from 'axios';
import Auth from '../auth/auth';

export default class OrderController {
  constructor(id) {
    this.id = id;
    /**
     * User object.
     *
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
  }

  /**
   * Get promise values.
   *
   * @return {Promise<AxiosResponse<Object>>[]}
   */
  getPromiseValues() {
    const headers = {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    };

    const workEndpoint = process.env.REACT_APP_WORKS_WITHOUT_PAGINATION;
    /**
     * Works promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const worksPromise = axios.get(workEndpoint, headers);

    const housesEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;
    /**
     * Houses promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const housesPromise = axios.get(housesEndpoint, headers);

    const execChoicesEndpoint = process.env.REACT_APP_EXECUTION_CHOICES;
    /**
     * Execution choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const execChoicesPromise = axios.get(execChoicesEndpoint, headers);

    const paymentChoicesEndpoint = process.env.REACT_APP_PAYMENT_CHOICES;
    /**
     * Payment choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const paymentChoicesPromise = axios.get(paymentChoicesEndpoint, headers);

    const usersChoicesEndpoint = process.env.REACT_APP_USERS_WITHOUT_PAGINATION;
    /**
     * Users choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const usersChoicesPromise = axios.get(usersChoicesEndpoint, headers);

    const executorChoicesEndpoint = process.env.REACT_APP_EXECUTOR_CHOICES;
    /**
     * Executor choices promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const executorChoicesPromise = axios.get(executorChoicesEndpoint, headers);

    if (this.id) {
      const orderEndpoint = process.env.REACT_APP_ORDER + this.id + '/';
      /**
       * Order promise
       * @type {Promise<AxiosResponse<object>>}
       */
      const orderPromise = axios.get(orderEndpoint, headers);
      
      return [worksPromise, housesPromise,
        execChoicesPromise, paymentChoicesPromise, usersChoicesPromise,
        executorChoicesPromise, orderPromise
      ];
    } else {
      return [worksPromise, housesPromise,
        execChoicesPromise, paymentChoicesPromise, usersChoicesPromise,
        executorChoicesPromise
      ];
    }
  }
}