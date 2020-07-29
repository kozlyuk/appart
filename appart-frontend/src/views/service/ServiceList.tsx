/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import ServiceController from '../../controllers/ServiceController';
import axios from 'axios';
import Page from '../../components/Page';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import { Badge, Button, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageSpinner from '../../components/PageSpinner';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';
import styles from '../apartmentAnalytics/apartmentAnalytics.module.css';

interface ServiceListInterface {
  isLoaded: boolean,
  data: any | null,
  paginationCount: string | null,
  paginationNext: string | null,
  paginationPrevious: string | null,
  itemsCountPerPage: number,
  pageRangeDisplayed: number,
  activePage: number | null
}

type Service = {
  pk: number,
  houses: [],
  name: string,
  description: string,
  uom_type: string,
  uom: string
}

export default class ServiceList extends Component<any, ServiceListInterface> {
  private ServiceController: ServiceController;

  constructor(props: any) {
    super(props);
    this.ServiceController = new ServiceController();
  }

  static contextType = PermissionContext;

  public state: ServiceListInterface = {
    isLoaded: false,
    data: null,
    paginationCount: null,
    paginationNext: null,
    paginationPrevious: null,
    //paginator settings
    itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
    pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
    activePage: null
    //paginator settings end
  };

  public componentDidMount(): void {
    this.loadData();
  }

  private loadData = (query?: string): void => {
    Promise.all(this.ServiceController.getListingPromise(query))
      .then(axios.spread((services: any) => {
        this.setState({
          isLoaded: true,
          data: services.data.results,
          paginationCount: services.data.count,
          paginationNext: services.data.next,
          paginationPrevious: services.data.previous
        });
      }));
  };

  private handlePageChange(pageNumber: number) {
    this.setState({ activePage: pageNumber });
    this.loadData();
  }

  private content(): JSX.Element {
    const data = this.state.data as any;
    return (
      <Table responsive>
        <thead>
        {/*
        // @ts-ignore*/}
        <tr align="center">
          <th className={styles.withoutPadding}>Сервіс</th>
          <th className={styles.withoutPadding}>Одиниця виміру</th>
          <th className={styles.withoutPadding}><Text text="rateList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {data?.map((item: Service) => (
          // @ts-ignore
          <tr align="center">
            <td className={styles.withoutPadding}>{item.name}</td>
            <td className={styles.withoutPadding}>{item.uom}</td>
            {/*
            // @ts-ignore*/}
            <td className={styles.withoutPadding} width="15%">
              <PermissionComponent
                aclList={this.context.service} permissionName="change"
              >
                <Link to={`service/${item.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    Редагування
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
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  Сервіси
                  <Link to="service/new">
                    <Button size="sm" className="float-right" color="success">
                      Додати сервіс
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