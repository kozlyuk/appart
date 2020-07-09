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

  public rateEndpoint = process.env['REACT_APP_RATES'];

  public housesEndpoint = process.env['REACT_APP_HOUSES_WITHOUT_PAGINATION'];

  public apartmentEndpoint = process.env['REACT_APP_APARTMENTS_WITHOUT_PAGINATION'];

  public servicesEndpoint = process.env['REACT_APP_SERVICES_WITHOUT_PAGINATION'];

  public getListingPromise(query: string | undefined = this.rateEndpoint): Promise<AxiosResponse<any>>[] {
    return [this.getRatesPromise(query)];
  }

  private getRatesPromise(query: string | undefined): Promise<AxiosResponse> {
    return axios.get(<string>query, this.headers);
  }

  private getRateByIdPromise(id: number): Promise<AxiosResponse> {
    return axios.get(`${this.rateEndpoint}${id}`, this.headers);
  }

  public getApartments(id: number): Promise<AxiosResponse>[] {
    return [axios.get(`${this.apartmentEndpoint}${id}`, this.headers)];
  }

  public getFilterPromise(): Promise<AxiosResponse<any>>[] {

    const getHouseEndpoint = process.env.REACT_APP_HOUSES_WITHOUT_PAGINATION as string;

    const getHousePromise = axios.get(getHouseEndpoint, this.headers);

    const getServiceEndpoint = process.env.REACT_APP_SERVICES_WITHOUT_PAGINATION as string;

    const getServicePromise = axios.get(getServiceEndpoint, this.headers);

    return [
      getHousePromise, getServicePromise
    ];
  }

  private getHousesPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.housesEndpoint, this.headers);
  }

  private getServicesPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.servicesEndpoint, this.headers);
  }

  public getUpdateFormPromise(id: number): Promise<AxiosResponse<any>>[] {
    return [
      this.getRateByIdPromise(id),
      this.getHousesPromise(),
      this.getServicesPromise()
    ];
  }

  public getCreateFormPromise(): Promise<AxiosResponse<any>>[] {
    return [
      this.getHousesPromise(),
      this.getServicesPromise()
    ];
  }
}