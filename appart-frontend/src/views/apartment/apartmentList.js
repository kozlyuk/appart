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
    this.filterSelectHandler = this.filterSelectHandler.bind(this);
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
      searchQuery: searchValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  }

  /**
   * Filter handler
   *
   * @param event
   */
  filterSelectHandler(event) {
    const selectValue = event.target.value.toString();
    this.setState({
      houseQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  }

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
    const houseQuery = this.state.houseQuery.trim();
    this.setState({ activePage: pageNumber });
    this.refreshData(pageNumber, `?filter=${searchQuery}&house=${houseQuery}`);
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
            filterSelectHandler={this.filterSelectHandler}
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