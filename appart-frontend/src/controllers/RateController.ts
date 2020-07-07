/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */


import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class RateController {

  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public getListingPromise(query: string | undefined = process.env['REACT_APP_RATES']): Promise<AxiosResponse<any>>[] {
    return [this.getRatesPromise(query)];
  }

  private getRatesPromise(query: string | undefined): Promise<AxiosResponse> {
    return axios.get(<string>query, this.headers);
  }

  public getFilterPromise(): Promise<AxiosResponse<any>>[] {
    const headers = {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    };
    const getHouseEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION as string;

    const getHousePromise = axios.get(getHouseEndpoint, headers);

    const getServiceEndpoint = process.env.REACT_APP_SERVICES_WITHOUT_PAGINATION as string;

    const getServicePromise = axios.get(getServiceEndpoint, headers);

    return [
      getHousePromise, getServicePromise
    ];
  }
}