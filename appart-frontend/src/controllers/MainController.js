/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import axios from 'axios';
import Auth from '../auth/auth';

export default class MainController {
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

    const getUserEndpoint = process.env.REACT_APP_USER_DATA;
    /**
     * Get user promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const getUserPromise = axios.get(getUserEndpoint, headers);

    const getAclEndpoint = process.env.REACT_APP_GET_ACL;
    /**
     * Get user promise
     * @type {Promise<AxiosResponse<object>>}
     */
    const getAclPromise = axios.get(getAclEndpoint, headers);

    return [
      getUserPromise, getAclPromise
    ];
  }
}