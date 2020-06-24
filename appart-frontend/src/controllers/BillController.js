/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import axios from 'axios';
import Auth from '../auth/auth';

export default class BillController {
  constructor(id) {
    this.id = id;
    /**
     * @type {Auth}
     * @private
     */
    this._user = new Auth();
  }

  getPromiseValues() {
    const headers = {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    };

    const housesEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;
    /**
     * Houses promise.
     * @type {Promise<AxiosResponse<object>>}
     */
    const housesPromise = axios.get(housesEndpoint, headers);

    const serviceEndpoint = process.env.REACT_APP_SERVICES_WITHOUT_PAGINATION;

    /**
     * Service promise.
     * @type {Promise<AxiosResponse<object>>}
     */
    const servicesPromise = axios.get(serviceEndpoint, headers);

    if (this.id) {
      const billEndpoint = process.env.REACT_APP_BILLS + this.id + '/';

      const billPromise = axios.get(billEndpoint, headers);

      return [
        housesPromise, servicesPromise, billPromise
      ];
    } else {
      return [
        housesPromise, servicesPromise
      ];
    }
  }
}