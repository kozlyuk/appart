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

  public apartmentBalanceSheetEndpoint = process.env['REACT_APP_APARTMENTS_BALANCE_SHEET'];

  public apartmentTotalValuesEndpoint = process.env['REACT_APP_APARTMENTS_TOTAL_ANALYTICS'];

  public apartmentAnalyticsEndpoint = process.env['REACT_APP_APARTMENTS_ANALYTICS'] + '?page_size=100';

  public getListingPromise(range: [string, string], query: string = this.apartmentAnalyticsEndpoint): Promise<AxiosResponse>[] {
    return [this.getApartmentsAnalyticsPromise(query), this.getApartmentAnalyticsTotalValuePromise(range)];
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

  public getApartmentsAnalyticsPromise(query: string): Promise<AxiosResponse> {
    return axios.get(<string>query, this.headers);
  }

  public getApartmentAnalyticsTotalValuePromise(range: [string, string]): Promise<AxiosResponse> {
    return axios.get(<string>`${this.apartmentTotalValuesEndpoint}?start_date=${range[0]}&finish_date=${range[1]}`, this.headers);
  }

  public getApartmentBalanceSheetPromise(id: number, range: [string, string]): Promise<AxiosResponse>[] {
    return [axios.get(`${this.apartmentBalanceSheetEndpoint}${id}/?start_date=${range[0]}&finish_date=${range[1]}`, this.headers)];
  }
}