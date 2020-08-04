import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import {Badge, Button, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import {Text} from 'react-easy-i18n';
import {Link} from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PaymentFilter from './filter/PaymentFilter';
import PageSpinner from '../../components/PageSpinner';
import {PermissionContext} from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';
import styles from '../apartmentAnalytics/apartmentAnalytics.module.css';
import PaymentController from "../../controllers/PaymentController";


export default class PaymentList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = process.env.REACT_APP_PAYMENT;
    this.PaymentController = new PaymentController()
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
  }

  state = {
    //paginator settings
    itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
    pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
    //paginator settings end
    searchQuery: '',
    houseQuery: '',
    serviceQuery: '',
    paymentTypeQuery: '',
    filterQueries: {
      is_recognized: 0
    }
  };

  static contextType = PermissionContext;

  getQueryString() {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const paymentTypeQuery = this.state.paymentTypeQuery.trim();
    this.dataUrl = `${process.env.REACT_APP_PAYMENT}?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&payment_type=${paymentTypeQuery}`;

    return this.dataUrl;
  }

  handlePageChange(pageNumber) {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const paymentTypeQuery = this.state.paymentTypeQuery.trim();
    this.setState({activePage: pageNumber});
    this.refreshData(
      pageNumber,
      `?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&payment_type=${paymentTypeQuery}`
    );
  }

  // /**
  //  * Search handler
  //  *
  //  * @param event
  //  */
  // filterSearchHandler(event) {
  //   event.preventDefault();
  //   const searchValue = event.target.search.value.toString();
  //   this.setState({
  //     searchQuery: searchValue
  //   }, () => {
  //     this.loadData(this.getQueryString());
  //   });
  // }

  // filterServiceHandler = (event) => {
  //   const selectValue = event.target.value.toString();
  //   this.setState({
  //     serviceQuery: selectValue
  //   }, () => {
  //     this.loadData(this.getQueryString());
  //   });
  // };

  // filterHouseHandler = (event) => {
  //   const selectValue = event.target.value.toString();
  //   this.setState({
  //     houseQuery: selectValue
  //   }, () => {
  //     this.loadData(this.getQueryString());
  //   });
  // };

  houseSelectHandler = (result) => {
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        house: result
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  companySelectHandler = (event) => {
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

  filterSearchHandler = (event) => {
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

  dateRangeHandler = (startDate, finishDate) => {
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

  filterIsActiveHandler = () => {
    this.setState({
      filterQueries: {
        ...this.state.filterQueries,
        // @ts-ignore
        is_recognized: !this.state.filterQueries.is_recognized >> 0
      }
    }, () => {
      this.loadData(this.filterUrlGenerator());
    });
  };

  filterUrlGenerator = () => {
    const {filterQueries} = this.state;
    const queryArray = Object.entries(filterQueries);
    let result = `${this.PaymentController.paymentEndpoint}?page_size=${process.env.REACT_APP_ITEMS_COUNT_PER_PAGE}`;
    queryArray.map((item) => {
      if (item[1] === null) {
      } else if (item[1][0]?.label) {
        item[1].map((nestedQuery) => {
          result += `&${item[0].toString()}=${nestedQuery?.value.toString().trim()}`;
        });
      } else {
        result += `&${item[0]}=${item[1]}`;
      }
    });

    return result;
  };

  // filterPaymentTypeHandler = (event) => {
  //   const selectValue = event.target.value.toString();
  //   this.setState({
  //     paymentTypeQuery: selectValue
  //   }, () => {
  //     this.loadData(this.getQueryString());
  //   });
  // };

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Table responsive>
        <thead>
        <tr align="center">
          <th className={styles.withoutPadding}><Text text="paymentList.tableHeader.apartment"/></th>
          <th className={styles.withoutPadding}><Text text="paymentList.tableHeader.value"/></th>
          <th className={styles.withoutPadding}><Text text="paymentList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((payment) => (
          <tr key={payment.pk} align="center">
            <td className={styles.withoutPadding}>{payment.apartment_name}</td>
            <td className={styles.withoutPadding}>{payment.value}</td>
            <td className={styles.withoutPadding} width="15%">
              <PermissionComponent
                aclList={this.context.payment} permissionName="change"
              >
                <Link to={`payment/${payment.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="userList.tableHeader.editBtn"/>
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

  /**
   *
   * @returns {*}
   */
  render() {
    const {error, isLoaded} = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <PageSpinner/>
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>);
    } else {
      return (
        <Page className="TablePage">
          <PaymentFilter
            // filterSearchHandler={this.filterSearchHandler}
            // filterHouseHandler={this.filterHouseHandler}
            // filterServiceHandler={this.filterServiceHandler}
            // filterPaymentTypeHandler={this.filterPaymentTypeHandler}
            // isLoaded={false}
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
                  <Text text="sidebar.payment"/>
                  <PermissionComponent
                    aclList={this.context.payment} permissionName="add"
                  >
                    <Link to="payment/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="paymentList.addBtn"/>
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