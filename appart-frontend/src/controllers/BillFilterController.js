/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios from 'axios';

export default class BillFilterController {
  constructor() {
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
    const getHouseEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;
    /**
     * Get house promise.
     * @type {Promise<AxiosResponse<object>>}
     */
    const getHousePromise = axios.get(getHouseEndpoint, headers);

    const getServiceEndpoint = process.env.REACT_APP_SERVICES_WITHOUT_PAGINATION;
    /**
     * Get service promise.
     * @type {Promise<AxiosResponse<object>>}
     */
    const getServicePromise = axios.get(getServiceEndpoint, headers);

    return [
      getHousePromise, getServicePromise
    ];
  }
}