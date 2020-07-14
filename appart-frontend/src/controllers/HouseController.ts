/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class HouseController {
  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public uomEndpoint = process.env['REACT_APP_GET_UOM_CHOICES'];

  public getUomValues(): Promise<AxiosResponse<any>>[] {
    return [this.getUomPromise()];
  }

  private getUomPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.uomEndpoint, this.headers);
  }
}