/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class ServiceController {
  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public serviceEndpoint = process.env['REACT_APP_SERVICES_URL'];

  public getListingPromise(query: string | undefined = this.serviceEndpoint): Promise<AxiosResponse>[] {
    return [this.getServicePromise(query)];
  }

  private getServicePromise(query: string | undefined): Promise<AxiosResponse> {
    return axios.get(<string>query, this.headers);
  }
}