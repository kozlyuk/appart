/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class ApartmentAnalyticsController {
  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public houseEndpoint = process.env['REACT_APP_HOUSES_WITHOUT_PAGINATION'];

  public companyEndpoint = process.env['REACT_APP_COMPANY'];

  public apartmentAnalyticsEndpoint = process.env['REACT_APP_APARTMENTS_ANALYTICS'] + '?page_size=100';

  public getListingPromise(): Promise<AxiosResponse>[] {
    return [this.getApartmentsAnalyticsPromise()];
  }

  public getFilterPromise(): Promise<AxiosResponse>[] {
    return [this.getCompaniesPromise(), this.getHousesPromise()];
  }

  public getCompaniesPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.companyEndpoint, this.headers);
  }

  public getHousesPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.houseEndpoint, this.headers);
  }

  public getApartmentsAnalyticsPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.apartmentAnalyticsEndpoint, this.headers);
  }
}