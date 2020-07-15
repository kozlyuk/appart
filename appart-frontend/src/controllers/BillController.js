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
  }

  _user = new Auth();

  headers = {
    headers: {
      'Authorization': 'Token ' + this._user.getAuthToken()
    }
  };

  housesEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION;

  serviceEndpoint = process.env.REACT_APP_SERVICES_WITHOUT_PAGINATION;

  uomEndpoint = process.env.REACT_APP_GET_UOM_CHOICES;

  getPromiseValues() {
    if (this.id) {
      return [this.getHousePromise(), this.getServicePromise(), this.getBillPromise()];
    } else {
      return [this.getHousePromise(), this.getServicePromise()];
    }
  }

  getCreateBillsValues() {
    return [this.getHousePromise(), this.getUomPromise()];
  }

  getBillPromise() {
    return axios.get(process.env.REACT_APP_BILLS + this.id + '/', this.headers);
  }

  getServicePromise() {
    return axios.get(this.serviceEndpoint, this.headers);
  }

  getHousePromise() {
    return axios.get(this.housesEndpoint, this.headers);
  }

  getUomPromise() {
    return axios.get(this.uomEndpoint, this.headers);
  }
}