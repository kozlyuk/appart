/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class DashboardController {
  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public registeredResidentsEndpoint = process.env['REACT_APP_REGISTERED_RESIDENTS'];

  public activeApartmentsEndpoint = process.env['REACT_APP_ACTIVE_APARTMENTS'];

  public totalDebtCompany = process.env['REACT_APP_TOTAL_DEBT_COMPANY'];

  public totalPaymentsCompany = process.env['REACT_APP_TOTAL_PAYMENTS_COMPANY'];

  public getDashboardValues(): Promise<AxiosResponse<any>>[] {
    return [
      this.getRegisteredResidentsPromise(),
      this.getActiveApartmentsPromise(),
      this.getTotalDebtPromise(),
      this.getTotalPaymentsPromise()
    ];
  }

  private getRegisteredResidentsPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.registeredResidentsEndpoint, this.headers);
  }

  private getActiveApartmentsPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.activeApartmentsEndpoint, this.headers);
  }

  private getTotalDebtPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.totalDebtCompany, this.headers);
  }

  private getTotalPaymentsPromise(): Promise<AxiosResponse> {
    return axios.get(<string>this.totalPaymentsCompany, this.headers);
  }
}