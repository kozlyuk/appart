/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosPromise, AxiosResponse } from 'axios';

interface PaymentFilterInterface {
}

export default class PaymentFilterController implements PaymentFilterInterface {

  private user: Auth = new Auth();

  constructor() {
    this.user = new Auth();
  }

  protected headers = {
    headers: {
      'Authorization': 'Token ' + this.user.getAuthToken()
    }
  };

  public getPromiseValues() {
    return [this.getServicesPromise(), this.getHousesPromise(), this.getPaymentTypePromise()];
  }

  private getApartments(housePk: number) {
    return [this.getApartmentsPromise(housePk)];
  }

  private getApartmentsPromise(housePk: number): Promise<AxiosResponse> {
    const getApartmentsEndpoint = `${process.env['REACT_APP_APARTMENTS_WITHOUT_PAGINATION']}?house=${housePk}`;

    return axios.get(<string>getApartmentsEndpoint, this.headers);
  }

  private getHousesPromise(): Promise<AxiosPromise> {
    const getHouseEndpoint: string | undefined = process.env['REACT_APP_HOUSES_WITHOUT_PAGINATION'];

    return axios.get(<string>getHouseEndpoint, this.headers);
  }

  private getPaymentTypePromise() {
    const getPaymentTypeEndpoint: string | undefined = process.env['REACT_APP_GET_PAYMENT_TYPE_CHOICES'];

    return axios.get(<string>getPaymentTypeEndpoint, this.headers);
  }

  private getServicesPromise(): Promise<AxiosResponse> {
    const getServicesEndpoint: string | undefined = process.env['REACT_APP_SERVICES_WITHOUT_PAGINATION'];

    return axios.get(<string>getServicesEndpoint, this.headers);
  }
}