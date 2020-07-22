/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React, { Component } from 'react';
import axios from 'axios';
import Page from '../../components/Page';
// @ts-ignore
import { Text } from 'react-easy-i18n';
import { Badge, Button, Card, CardBody, CardHeader, Col, Pagination, Row, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import PageSpinner from '../../components/PageSpinner';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';
import CompanyController from '../../controllers/CompanyController';

interface CompanyListInterface {
  isLoaded: boolean,
  data: any | null,
  paginationCount: string | null,
  paginationNext: string | null,
  paginationPrevious: string | null,
  itemsCountPerPage: number,
  pageRangeDisplayed: number,
  activePage: number | null
}

type Company = {
  pk: number,
  address: string,
  bank_requisites: string,
  chief: string,
  description: string,
  fullname: string,
  logo: string,
  name: string,
  phone: string,
  requisites: string
}

export default class CompanyList extends Component<any, CompanyListInterface> {
  private CompanyController: CompanyController;

  constructor(props: any) {
    super(props);
    this.CompanyController = new CompanyController();
  }

  static contextType = PermissionContext;

  public state: CompanyListInterface = {
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
    Promise.all(this.CompanyController.getListingPromise(query))
      .then(axios.spread((company: any) => {
        this.setState({
          isLoaded: true,
          data: company.data,
          paginationCount: company.data.count,
          paginationNext: company.data.next,
          paginationPrevious: company.data.previous
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
          <th>Логотип</th>
          <th>Назва</th>
          <th>Адресса</th>
          <th><Text text="rateList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {data?.map((item: Company) => (
          // @ts-ignore
          <tr align="center" key={item.pk}>
            <td>
              <img style={{ height: '30px' }} src={item.logo}
                   alt="company logo"/>
            </td>
            <td>{item.name}</td>
            <td>{item.address}</td>
            {/*
            // @ts-ignore*/}
            <td width="15%">
              <PermissionComponent
                aclList={this.context.service} permissionName="change"
              >
                <Link to={`company/${item.pk}/edit`}>
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
                  Компанії
                  <Link to="service/new">
                    <Button size="sm" className="float-right" color="success">
                      Додати компанію
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