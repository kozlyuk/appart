/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import PageSpinner from '../../components/PageSpinner';
import Page from '../../components/Page';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
// @ts-ignore
import Pagination from 'react-js-pagination';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import ApartmentAnalyticsController from '../../controllers/ApartmentAnalyticsController';
import axios from 'axios';
import AnalyticsFilter from './filter/AnalyticsFilter';
import AnalyticsLine from './components/AnalyticsLine';
import moment from 'moment';
import styles from './apartmentAnalytics.module.css';

interface ApartmentAnalyticsInterface {
  isLoaded: boolean,
  data?: Apartment,
  totalValues?: TotalValues,
  itemsCountPerPage: number,
  pageRangeDisplayed: number,
  activePage?: number,
  paginationCount?: number,
  paginationNext?: string,
  paginationPrevious?: string,
  filterQueries?: any
}

interface ApartmentAnalyticsProps {
}

type TotalValues = {
  current_total_debt: number,
  period_total_bills_sum: number,
  period_total_payments_sum: number,
  total_apartments_count: number
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

export default class ApartmentAnalytics extends Component<ApartmentAnalyticsProps, ApartmentAnalyticsInterface> {

  // @ts-ignore
  private AnalyticsFilter: AnalyticsFilter = new AnalyticsFilter();

  public state: ApartmentAnalyticsInterface = {
    isLoaded: false,
    data: undefined,
    //paginator settings
    itemsCountPerPage: 100,
    pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
    activePage: undefined,
    paginationCount: undefined,
    filterQueries: {
      is_active: true,
      start_date: moment(this.AnalyticsFilter.getMonthRange(new Date()).from).format('YYYY-MM-DD'),
      finish_date: moment(this.AnalyticsFilter.getMonthRange(new Date()).to).format('YYYY-MM-DD')
    }
    //paginator settings end
  };

  private ApartmentAnalyticsController: ApartmentAnalyticsController = new ApartmentAnalyticsController();

  public componentDidMount(): void {
    const range = [this.state.filterQueries.start_date, this.state.filterQueries.finish_date] as [string, string];
    Promise.all(this.ApartmentAnalyticsController.getListingPromise(range))
      .then(axios.spread((
        apartments,
        totalValues
      ) => {
        this.setState({
          isLoaded: true,
          data: apartments.data.results,
          totalValues: totalValues.data,
          paginationCount: apartments.data.count,
          paginationNext: apartments.data.next,
          paginationPrevious: apartments.data.previous
        });
      }));
  }

  private loadData(dataUrl: string): void {
    const range = [this.state.filterQueries.start_date, this.state.filterQueries.finish_date] as [string, string];
    Promise.all(this.ApartmentAnalyticsController.getListingPromise(range, dataUrl))
      .then(axios.spread((
        apartments: any,
        totalValues: any
        ) => {
          this.setState({
            isLoaded: true,
            data: apartments.data.results,
            totalValues: totalValues.data,
            paginationCount: apartments.data.count,
            paginationNext: apartments.data.next,
            paginationPrevious: apartments.data.previous
          });
        }
      ));
  }

  private filterSearchHandler = (event: any): void => {
    event.preventDefault();
    const searchValue = event.target.search.value.toString();
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        filter: searchValue
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  private companySelectHandler = (event: any): void => {
    const selectedValue = event.target.value;
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        company: selectedValue
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  private houseSelectHandler = (event: any): void => {
    const selectedValue = [...event.target.selectedOptions].map(opt => opt.value);
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        house: selectedValue
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  private dateRangeHandler = (startDate: Date, finishDate: Date): void => {
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        start_date: startDate,
        finish_date: finishDate
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  private filterUrlGenerator = (): string => {
    const { filterQueries } = this.state;
    const queryArray = Object.entries(filterQueries);
    let result = this.ApartmentAnalyticsController.apartmentAnalyticsEndpoint;
    queryArray.map((item: any) => {
      result += `&${item[0].toString()}=${item[1].toString().trim()}`;
    });

    return result;
  };

  private filterIsActiveHandler = (): void => {
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        // @ts-ignore
        is_active: !this.state.filterQueries.is_active >> 0
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  handlePageChange(pageNumber: number) {
    this.setState({
      activePage: pageNumber,
      filterQueries: {
        ...this.state.filterQueries,
        page: pageNumber
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  }

  private content = (): JSX.Element => {
    const data = this.state.data as any;
    const total = this.state.totalValues;
    return (
      <Table responsive>
        <thead>
        {/*
        // @ts-ignore*/}
        <tr align="center">
          <th className={styles.withoutPadding + ' align-top'}>Назва будинку<br/>{' '}</th>
          <th className={styles.withoutPadding + ' align-top'}>Апартаменти<br/>{' '}</th>
          <th className={styles.withoutPadding}>Житель <br/>
            Всього: <Badge color="info" pill>{total?.total_apartments_count}</Badge>
          </th>
          <th className={styles.withoutPadding + ' align-top'}>Рахунок</th>
          <th className={styles.withoutPadding + ' align-top'}>Заборгованість<br/>
            Всього: <Badge color="info" pill>{total?.current_total_debt}</Badge></th>
          <th className={styles.withoutPadding}>Загальна заборгованість<br/>
            Всього: <Badge color="info" pill>{total?.period_total_bills_sum}</Badge></th>
          <th className={styles.withoutPadding}>Оплачено<br/>
            Всього: <Badge color="info" pill>{total?.period_total_payments_sum}</Badge></th>
        </tr>
        </thead>
        <tbody>
        {data.map((item: Apartment) => (
          <AnalyticsLine
            // @ts-ignore
            key={item.pk} analyticsLine={item}
            filterRange={[this.state.filterQueries.start_date, this.state.filterQueries.finish_date]}
          />
        ))}
        </tbody>
      </Table>
    );
  };

  public render(): JSX.Element {
    if (this.state.isLoaded) {
      return (
        // @ts-ignore
        <Page className="TablePage">
          <AnalyticsFilter
            houseSelectHandler={this.houseSelectHandler}
            companySelectHandler={this.companySelectHandler}
            filterSearchHandler={this.filterSearchHandler}
            dateRangeHandler={this.dateRangeHandler}
            filterIsActiveHandler={this.filterIsActiveHandler}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.analytics"/>
                </CardHeader>
                <CardBody>
                  {this.content()}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Pagination
              innerClass="pagination pagination-sm ml-auto mr-auto"
              itemClass="page-item"
              linkClass="page-link"
              pageRangeDisplayed={this.state.pageRangeDisplayed}
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemsCountPerPage}
              totalItemsCount={this.state.paginationCount}
              //@ts-ignore
              onChange={this.handlePageChange.bind(this)}
            />
          </Row>
        </Page>
      );
    } else {
      return (<PageSpinner/>);
    }
  }
}