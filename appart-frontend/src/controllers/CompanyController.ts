/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosResponse } from 'axios';

export default class CompanyController {
  public user: Auth = new Auth();

  protected headers: object = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public companyEndpoint = process.env['REACT_APP_COMPANY'];

  public getListingPromise(query: string | undefined = this.companyEndpoint): Promise<AxiosResponse>[] {
    return [this.getCompaniesPromise(query)];
  }

  public getCompaniesPromise(query: string | undefined): Promise<AxiosResponse> {
    return axios.get(<string>query, this.headers);
  }

  public getUpdateFormPromise(id: number): Promise<AxiosResponse>[] {
    return [this.getCompanyById(id)];
  }

  public getCreateFormPromise(): [void] {
    return [void 0];
  }

  // public getCreateFormPromise(): void {
  //   return void 0;
  // }

  private getCompanyById(id: number): Promise<AxiosResponse> {
    return axios.get(`${this.companyEndpoint}${id}/`, this.headers);
  }
}