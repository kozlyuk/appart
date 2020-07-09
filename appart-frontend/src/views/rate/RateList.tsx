/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import RateController from '../../controllers/RateController';
import axios from 'axios';
import PageSpinner from '../../components/PageSpinner';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';
import RateFilter from './filter/RateFilter';

interface RateListInterface {
  isLoaded: boolean,
  data: {
    count: number,
    next: string,
    previous: string,
    results: Rate,
  } | null,
  searchQuery: string,
  houseQuery: string,
  serviceQuery: string,
  itemsCountPerPage: number,
  pageRangeDisplayed: number,
  activePage?: number,
  paginationCount?: number,
  paginationNext?: string,
  paginationPrevious?: string
}

type Rate = {
  pk: number,
  house_name: string,
  service_name: string,
  from_date: string,
  house: number,
  service: number,
  value: string
}

export default class RateList extends Component<any, RateListInterface> {
  private RateController: RateController;

  private Query: string | undefined;

  constructor(props: any) {
    super(props);
    this.RateController = new RateController();
    this.Query = process.env['REACT_APP_RATES'];
  }

  public state: RateListInterface = {
    isLoaded: false,
    data: null,
    searchQuery: '',
    houseQuery: '',
    serviceQuery: '',
    //paginator settings
    itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
    pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
    activePage: undefined,
    paginationCount: undefined
    //paginator settings end
  };

  static contextType = PermissionContext;

  componentDidMount(): void {
    this.loadData();
  }

  public getQueryString(): string {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    this.Query = `${process.env['REACT_APP_RATES']}?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}`;

    return this.Query;
  }

  private loadData = (query?: string): void => {
    Promise.all(this.RateController.getListingPromise(query))
      .then(axios.spread((rates: any) => {
        this.setState({
          isLoaded: true,
          data: rates.data,
          paginationCount: rates.data.count,
          paginationNext: rates.data.next,
          paginationPrevious: rates.data.previous
        });
      }));
  };

  private filterSearchHandler = (event: any): void => {
    event.preventDefault();
    const searchValue = event.target.search.value.toString();
    this.setState({
      searchQuery: searchValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  private filterHouseHandler = (event: any): void => {
    const selectValue = event.target.value.toString();
    this.setState({
      houseQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  private filterServiceHandler = (event: any): void => {
    const selectValue = event.target.value.toString();
    this.setState({
      serviceQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  private handlePageChange(pageNumber: number) {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    this.setState({ activePage: pageNumber });
    this.refreshData(
      pageNumber,
      `?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}`
    );
  }

  private refreshData(page: number, queryParams: string) {
    if (!queryParams) {
      axios(`${this.RateController.rateEndpoint}?page=${page}`, {
        headers: {
          'Authorization': 'Token ' + this.RateController.user.getAuthToken()
        }
      })
        .then(
          result => {
            this.setState({
              isLoaded: true,
              data: result.data,
              paginationCount: result.data.count,
              paginationNext: result.data.next,
              paginationPrevious: result.data.previous
            });
          },
          error => {
            this.setState({
              isLoaded: true
            });
          }
        );
    } else {
      axios(`${this.RateController.rateEndpoint}${queryParams}&page=${page}`, {
        headers: {
          'Authorization': 'Token ' + this.RateController.user.getAuthToken()
        }
      })
        .then(
          result => {
            this.setState({
              isLoaded: true,
              data: result.data,
              paginationCount: result.data.count,
              paginationNext: result.data.next,
              paginationPrevious: result.data.previous
            });
          },
          error => {
            this.setState({
              isLoaded: true
            });
          }
        );
    }
  }

  private content(): JSX.Element {
    const data = this.state.data?.results as any;
    return (
      <Table responsive>
        <thead>
        {/*
        // @ts-ignore*/}
        <tr align="center">
          <th><Text text="rateList.tableHeader.houseName"/></th>
          <th><Text text="rateList.tableHeader.serviceName"/></th>
          <th><Text text="rateList.tableHeader.value"/></th>
          <th><Text text="rateList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {data?.map((item: Rate) => (
          // @ts-ignore
          <tr align="center">
            <td>{item.house_name}</td>
            <td>{item.service_name}</td>
            {/*
            // @ts-ignore*/}
            <td width="5%">{item.value}</td>
            {/*
            // @ts-ignore*/}
            <td width="15%">
              <PermissionComponent
                aclList={this.context.rate} permissionName="change"
              >
                <Link to={`rate/${item.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="rateList.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  }

  public render(): JSX.Element {
    if (this.state.isLoaded) {
      return (
        // @ts-ignore
        <Page
          className="TablePage"
        >
          <RateFilter
            filterSearchHandler={this.filterSearchHandler}
            filterHouseHandler={this.filterHouseHandler}
            filterServiceHandler={this.filterServiceHandler}
            isLoaded
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.rate"/>
                  <Link to="rate/new">
                    <Button size="sm" className="float-right" color="success">
                      <Text text="rateList.addBtn"/>
                    </Button>
                  </Link>
                </CardHeader>
                <CardBody>
                  {this.content()}
                </CardBody>
              </Card>
            </Col>
          </Row>
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
        </Page>
      );
    } else {
      return (
        <PageSpinner/>
      );
    }
  }
}