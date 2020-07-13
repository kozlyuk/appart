/**
 * Bill list view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PageSpinner from '../../components/PageSpinner';
import BillFilter from './filter/BillFilter';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';


export default class BillList extends AbstractListView {
  /**
   * Bill list constructor.
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
      //paginator settings end
      searchQuery: '',
      houseQuery: '',
      serviceQuery: '',
      isActiveQuery: true
    };
    this.dataUrl = process.env.REACT_APP_BILLS;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
  }

  static contextType = PermissionContext;

  /**
   * @return {string}
   */
  getQueryString() {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const isActiveQuery = this.state.isActiveQuery;
    this.dataUrl = `${process.env.REACT_APP_BILLS}?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&is_active=${isActiveQuery}`;

    return this.dataUrl;
  }

  /**
   * Paginator
   *
   * @param pageNumber
   */
  handlePageChange(pageNumber) {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const isActiveQuery = this.state.isActiveQuery;
    this.setState({ activePage: pageNumber });
    this.refreshData(
      pageNumber,
      `?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&is_active=${isActiveQuery}`
    );
  }

  /**
   * Search handler
   *
   * @param event
   */
  filterSearchHandler(event) {
    event.preventDefault();
    const searchValue = event.target.search.value.toString();
    this.setState({
      searchQuery: searchValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  }

  /**
   * Filter for house select input.
   *
   * @param event
   */
  filterHouseHandler = (event) => {
    const selectValue = event.target.value.toString();
    this.setState({
      houseQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  /**
   * Filter for service select input.
   *
   * @param event
   */
  filterServiceHandler = (event) => {
    const selectValue = event.target.value.toString();
    this.setState({
      serviceQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  /**
   * Filter for is active checkbox.
   *
   * @param event
   */
  filterIsActiveHandler = (event) => {
    this.setState({
      isActiveQuery: !this.state.isActiveQuery
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  onPrintBillsClick = (pk) => {
    console.log('print ' + pk);
  };

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Table responsive>
        <thead>
        <tr align="center">
          <th><Text text="billList.tableHeader.apartment"/></th>
          <th><Text text="billList.tableHeader.apartmentNumber"/></th>
          <th><Text text="billList.tableHeader.purpose"/></th>
          <th><Text text="billList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((bill) => (
          <tr key={bill.pk} align="center">
            <td>{bill.apartment_name}</td>
            <td>{bill.number}</td>
            <td>{bill.purpose}</td>
            <td width="15%">
              <PermissionComponent
                aclList={this.context.bill} permissionName="view"
              >
                <Link to={`bill/${bill.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="billList.update"/>
                  </Badge>
                </Link>
              </PermissionComponent>
              <Badge style={{ cursor: 'pointer' }} onClick={() => this.onPrintBillsClick(bill.pk)} color="secondary"
                     className="mr-1">
                Друкувати рахунки
              </Badge>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    );
  }

  /**
   *
   * @returns {*}
   */
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {
      return (
        <Page
          className="TablePage"
        >
          <BillFilter
            filterSearchHandler={this.filterSearchHandler}
            filterHouseHandler={this.filterHouseHandler}
            filterServiceHandler={this.filterServiceHandler}
            filterIsActiveHandler={this.filterIsActiveHandler}
            isLoaded
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.bills"/>
                  <PermissionComponent
                    aclList={this.context.bill} permissionName="add"
                  >
                    <Link to="bill/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="billList.addBtn"/>
                      </Button>
                    </Link>
                  </PermissionComponent>
                </CardHeader>
                <CardBody>
                  {this.content()}
                  <Row>
                    <Pagination
                      innerClass="pagination pagination-sm ml-auto mr-auto"
                      itemClass="page-item"
                      linkClass="page-link"
                      pageRangeDisplayed={this.state.pageRangeDisplayed}
                      activePage={this.state.activePage}
                      itemsCountPerPage={this.state.itemsCountPerPage}
                      totalItemsCount={this.state.paginationCount}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      );
    }
  }
}