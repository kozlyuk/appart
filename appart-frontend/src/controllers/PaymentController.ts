/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import Auth from '../auth/auth';
import axios, { AxiosPromise, AxiosResponse } from 'axios';

interface PaymentControllerInterface {
  id: string
}

export default class PaymentController implements PaymentControllerInterface {

  public id: string;

  private _user: Auth = new Auth();

  constructor(id: string) {
    this.id = id;
    this._user = new Auth();
  }

  protected headers = {
    headers: {
      'Authorization': 'Token ' + this._user.getAuthToken()
    }
  };

  public getPromiseValues() {
    if (this.id) {
      return [this.getServicesPromise(), this.getHousesPromise(), this.getPaymentTypePromise(), this.getPaymentPromise()];
    } else {
      return [this.getServicesPromise(), this.getHousesPromise(), this.getPaymentTypePromise()];
    }
  }

  public getApartments(housePk: number) {
    return [this.getApartmentsPromise(housePk)];
  }

  private getPaymentPromise(): Promise<AxiosPromise> {
    const getPaymentEndpoint: string = process.env['REACT_APP_PAYMENT'] + this.id + '/';

    return axios.get(<string>getPaymentEndpoint, this.headers);
  }

  private getHousesPromise(): Promise<AxiosPromise> {
    const getHouseEndpoint: string | undefined = process.env['REACT_APP_HOUSES_WITHOUT_PAGINATION'];

    return axios.get(<string>getHouseEndpoint, this.headers);
  }

  private getPaymentTypePromise(): Promise<AxiosPromise> {
    const getPaymentTypeEndpoint: string | undefined = process.env['REACT_APP_GET_PAYMENT_TYPE_CHOICES'];

    return axios.get(<string>getPaymentTypeEndpoint, this.headers);
  }

  private getApartmentsPromise(housePk: number): Promise<AxiosResponse> {
    const getApartmentsEndpoint: string = `${process.env['REACT_APP_APARTMENTS_WITHOUT_PAGINATION']}?house=${housePk}`;

    return axios.get(<string>getApartmentsEndpoint, this.headers);
  }

  private getServicesPromise(): Promise<AxiosResponse> {
    const getServicesEndpoint: string | undefined = process.env['REACT_APP_SERVICES_WITHOUT_PAGINATION'];

    return axios.get(<string>getServicesEndpoint, this.headers);
  }

}