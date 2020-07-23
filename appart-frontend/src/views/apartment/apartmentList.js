import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { FaCheck } from 'react-icons/fa';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApartmentFilter from './filter/ApartmentFilter';
import { MdClose } from 'react-icons/md';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from 'react-reveal/Fade';
import PageSpinner from '../../components/PageSpinner';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';


export default class ApartmentList extends AbstractListView {
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
      //paginator settings end
      isLoaded: false,
      isFilterActive: true,
      houseQuery: '',
      searchQuery: ''
    };
    this.groupProps = {
      appear: true,
      enter: true,
      exit: true
    };
    this.filterUrl = process.env.REACT_APP_HOUSES_URL;
    this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
  }

  static contextType = PermissionContext;

  /**
   * Search handler
   *
   * @param event
   */
  filterSearchHandler(event) {
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
  }

  filterUrlGenerator() {
    const { filterQueries } = this.state;
    const queryArray = Object.entries(filterQueries);
    let result = this.dataUrl;
    queryArray.map((item, index) => {
      if (index === 0) {
        // if (item[1][1]) {
        //   result += this.nestedQuery(item[1], item[0], '?');
        // } else {
        result += '?' + item[0].toString() + '=' + item[1].toString().trim();
        // }
      } else {
        // if (item[1][1]) {
        //   result += this.nestedQuery(item[1], item[0], '&');
        // } else {
        result += '&' + item[0].toString() + '=' + item[1].toString().trim();
        // }
      }
    });

    return result;
  }

  nestedQuery(query, queryName, selector) {
    let queryString = '';
    query.map(nested => {
      queryString += selector + queryName + '=' + nested.toString();
    });

    return queryString;
  }

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

  houseSelectHandler = (event) => {
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

  /**
   * Get query string
   *
   * @return {string}
   */
  getQueryString() {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();

    return `${this.dataUrl}?filter=${searchQuery}&house=${houseQuery}`;
  }

  /**
   *
   * @return {*}
   */
  content() {
    return (
      <TransitionGroup {...this.groupProps}>
        <Fade opposite key={'2'} spy={this.state.data}>
          <Table responsive>
            <thead>
            <tr align="center">
              <th><Text text="apartmentList.tableHeader.number"/></th>
              <th><Text text="apartmentList.tableHeader.house"/></th>
              <th><Text text="apartmentList.tableHeader.resident"/></th>
              <th width="2%"><Text text="apartmentList.tableHeader.isActive"/></th>
              <th><Text text="apartmentList.tableHeader.actions"/></th>
            </tr>
            </thead>
            <tbody>
            {this.state.data.map((apartment) => (
              <tr key={apartment.pk} align="center">
                <td width="2%">{apartment.number}</td>
                <td>{apartment.house_name}</td>
                {apartment.resident ? <td>{apartment.resident_name}</td>
                  : <td><Text text="apartmentList.emptyApartment"/></td>}
                <td>
                  {apartment.is_active ?
                    <FaCheck className="text-success"/>
                    :
                    <MdClose className="text-danger"/>
                  }
                </td>
                <td width="15%">
                  <PermissionComponent
                    aclList={this.context.apartment} permissionName="change"
                  >
                    <Link to={`apartment/${apartment.pk}/edit`}>
                      <Badge color="warning" className="mr-1">
                        <Text text="apartmentList.tableHeader.editBtn"/>
                      </Badge>
                    </Link>
                  </PermissionComponent>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Fade>
      </TransitionGroup>
    );
  }

  /**
   * Paginator
   *
   * @param pageNumber
   */
  handlePageChange(pageNumber) {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.filterQueries.house.trim();
    const companyQuery = this.state.filterQueries.company.trim();
    this.setState({ activePage: pageNumber });
    this.refreshData(pageNumber, `?filter=${searchQuery}&house=${houseQuery}&company=${companyQuery}`);
  }

  render() {
    const { error, isLoaded } = this.state;
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
        <Page
          className="TablePage"
        >
          <ApartmentFilter
            data={this.state.filterData}
            houseSelectHandler={this.houseSelectHandler}
            companySelectHandler={this.companySelectHandler}
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={this.state.isFilterLoaded}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.apartment"/>
                  <PermissionComponent
                    aclList={this.context.apartment} permissionName="add"
                  >
                    <Link to="apartment/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="apartmentList.addBtn"/>
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
                      onChange={
                        this.handlePageChange.bind(this)
                      }
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