/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import styles from '../apartmentAnalytics.module.css';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import PageSpinner from '../../../components/PageSpinner';
import axios from 'axios';
import ApartmentAnalyticsController from '../../../controllers/ApartmentAnalyticsController';

interface AnalyticsLineProps {
  analyticsLine: Apartment,
  filterRange: [string, string]
}

interface AnalyticsLineState {
  isLoaded: boolean,
  modalContentLoaded: boolean,
  toggleModal: boolean,
  modalContentData?: ModalContent
}

type ModalContent = {
  Bills: Bills[],
  Payments: Payments[]
}

type Bills = {
  apartment: number,
  apartment_account_number: string,
  apartment_area: string,
  apartment_name: string,
  apartment_number: string,
  bill_lines: BillLine[]
  house_address: string,
  is_active: boolean,
  local_period: string,
  number: string,
  period: string
  pk: number,
  purpose: string,
  resident_name: string,
  total_value: string
}

type BillLine = {
  exemption_value: string,
  pk: number,
  previous_debt: string,
  rate: number,
  service: number,
  service_name: string,
  total_debt: string,
  value: string
}

type Payments = {
  apartment: number,
  apartment_name: string,
  date: string,
  description: string,
  payment_service: PaymentLine[],
  payment_type: string,
  payment_type_name: string,
  pk: number,
  value: string
}

type PaymentLine = {
  pk: number,
  service: number,
  service_name: string,
  value: string
}

type Apartment = {
  account_number: string,
  current_total_debt: number,
  house_name: string,
  number: number,
  period_total_bills: number,
  period_total_payments: number,
  pk: number,
  resident_name: string
}

export default class AnalyticsLine extends Component<AnalyticsLineProps, AnalyticsLineState> {

  private ApartmentAnalyticsController: ApartmentAnalyticsController = new ApartmentAnalyticsController();

  public state: AnalyticsLineState = {
    isLoaded: true,
    modalContentLoaded: false,
    toggleModal: false
  };

  private enableModal = (pk: number): void => {
    this.toggleModal();
    const filterRange = this.props.filterRange;
    Promise.all(this.ApartmentAnalyticsController.getApartmentBalanceSheetPromise(pk, filterRange))
      .then(axios.spread((result) => {
        this.setState({
          modalContentLoaded: true,
          modalContentData: result.data
        });
      }));
  };

  private toggleModal = () => {
    this.setState({ toggleModal: !this.state.toggleModal });
  };

  private modalBills = (): JSX.Element => {
    if (this.state.modalContentData?.Bills[0]) {
      return (
        <>
          <h4 className="text-center">Рахунки</h4>
          <Table responsive hover>
            <thead>
            {/*
            //@ts-ignore*/}
            <tr align="center">
              <th>Адреса</th>
              <th>Площа</th>
              <th>Житель</th>
              <th>Рахунок</th>
              <th>Період</th>
              <th>Послуги</th>
              <th>Загальна вартість</th>
            </tr>
            </thead>
            <tbody>
            {this.state.modalContentData?.Bills.map((item: Bills) => (
              <>
                {/*
                 //@ts-ignore*/}
                <tr align="center" style={{ backgroundColor: '#e5e5e5' }}>
                  <td className={styles.withoutPadding}>{item.house_address}</td>
                  <td className={styles.withoutPadding}>{item.apartment_area}</td>
                  <td className={styles.withoutPadding}>{item.resident_name}</td>
                  <td className={styles.withoutPadding}>{item.apartment_account_number}</td>
                  <td className={styles.withoutPadding}>{item.local_period}</td>
                  <td className={styles.withoutPadding}>{item.purpose}</td>
                  <td className={styles.withoutPadding}>{item.total_value}</td>
                </tr>
                {this.billLine(item)}
              </>
            ))}
            </tbody>
          </Table>
        </>
      );
    } else {
      return <></>;
    }
  };

  private billLine = (bills: Bills) => {
    const billLines: BillLine[] = bills.bill_lines;
    if (billLines[0]) {
      return (
        billLines.map((item: BillLine) => (
          //@ts-ignores
          <tr align="center">
            <td colSpan={5}/>
            <td className={styles.withoutPadding}>{item.service_name}</td>
            <td className={styles.withoutPadding}>{item.value}</td>
          </tr>
        ))
      );
    } else {
      return <></>;
    }
  };

  private modalPayments = (): JSX.Element => {
    if (this.state.modalContentData?.Payments[0]) {
      return (
        <>
          <h4 className="text-center">Оплати</h4>
          <Table responsive hover>
            <thead>
            {/*
              //@ts-ignore*/}
            <tr align="center">
              <th>Дата</th>
              <th>Опис</th>
              {/*<th>Житель</th>*/}
              <th>Тип оплати</th>
              <th>Вартість</th>
            </tr>
            </thead>
            <tbody>
            {this.state.modalContentData?.Payments.map((item: Payments) => (
              <>
                {/*
                //@ts-ignore*/}
                <tr align="center" style={{ backgroundColor: '#e5e5e5' }}>
                  <td className={styles.withoutPadding}>{item.date}</td>
                  <td className={styles.withoutPadding}>{item.description}</td>
                  {/*<td className={styles.withoutPadding}>{item.payment_service}</td>*/}
                  <td className={styles.withoutPadding}>{item.payment_type_name}</td>
                  <td className={styles.withoutPadding}>{item.value}</td>
                </tr>
                {this.paymentLine(item)}
              </>
            ))}
            </tbody>
          </Table>
        </>
      );
    } else {
      return <></>;
    }
  };

  private paymentLine = (payment: Payments) => {
    const paymentLine: PaymentLine[] = payment.payment_service;
    if (paymentLine[0]) {
      return (
        paymentLine.map((item: PaymentLine) => (
          //@ts-ignores
          <tr align="center">
            <td colSpan={2}/>
            <td className={styles.withoutPadding}>{item.service_name}</td>
            <td className={styles.withoutPadding}>{item.value}</td>
          </tr>
        ))
      );
    } else {
      return <></>;
    }
  };

  private modalContent = (): JSX.Element => {
    if (this.state.modalContentLoaded) {
      return (
        <>
          {this.modalBills()}
          {this.modalPayments()}
        </>
      );
    } else {
      return (
        <PageSpinner/>
      );
    }
  };

  public render(): JSX.Element {
    const { analyticsLine }: AnalyticsLineProps = this.props;
    return (
      <>
        {/*
        //@ts-ignore*/}
        <tr key={analyticsLine.pk} align="center" style={{ cursor: 'pointer' }}
            onClick={() => this.enableModal(analyticsLine.pk)}>
          <td className={styles.withoutPadding}>{analyticsLine.house_name}</td>
          <td className={styles.withoutPadding}>{analyticsLine.number}</td>
          <td className={styles.withoutPadding}>{analyticsLine.resident_name}</td>
          <td className={styles.withoutPadding}>{analyticsLine.account_number}</td>
          <td className={styles.withoutPadding}>{analyticsLine.current_total_debt}</td>
          <td className={styles.withoutPadding}>{analyticsLine.period_total_bills}</td>
          <td className={styles.withoutPadding}>{analyticsLine.period_total_payments}</td>
        </tr>
        <Modal isOpen={this.state.toggleModal} toggle={this.toggleModal} size="xl">
          <ModalHeader toggle={this.toggleModal}>Особовий рахунок: {analyticsLine.account_number} для
            апартаментів № {analyticsLine.number} {analyticsLine.house_name}</ModalHeader>
          <ModalBody>
            {this.modalContent()}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>Закрити</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}