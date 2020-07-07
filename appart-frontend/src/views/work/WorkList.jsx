import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import { Badge, Button, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Fade from 'react-reveal/Fade';
import PageSpinner from '../../components/PageSpinner';
import WorkFilter from './filter/WorkFilter';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';


export default class WorkList extends AbstractListView {
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
      //paginator settings end
      isFilterActive: true,
      houseQuery: '',
      searchQuery: ''
    };
    this.groupProps = {
      appear: true,
      enter: true,
      exit: true
    };
    this.filterUrl = process.env.REACT_APP_WORKS;
    this.dataUrl = process.env.REACT_APP_WORKS;
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

  sample = {
    'pk': 2,
    'name': 'awdafasqadqa',
    'price_code': '2134',
    'price': '1231.00',
    'description': 'afa',
    'duration': null
  };

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
              <th><Text text="workList.tableHeader.name"/></th>
              <th><Text text="workList.tableHeader.priceCode"/></th>
              <th><Text text="workList.tableHeader.price"/></th>
              <th width="2%"><Text text="workList.tableHeader.duration"/></th>
              <th><Text text="workList.tableHeader.actions"/></th>
            </tr>
            </thead>
            <tbody>
            {this.state.data.map((work) => (
              <tr key={work.pk} align="center">
                <td>{work.name}</td>
                <td>{work.price_code}</td>
                <td>{work.price}</td>
                {work.duration ?
                  <td>{work.duration}</td>
                  :
                  <td><Text text="workList.emptyDuration"/></td>
                }
                <td width="15%">
                  <PermissionComponent
                    aclList={this.context.work} permissionName="change"
                  >
                    <Link to={`work/${work.pk}/edit`}>
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
          <WorkFilter
            data={this.state.filterData}
            filterSelectHandler={this.filterSelectHandler}
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={this.state.isFilterLoaded}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.work"/>
                  <PermissionComponent
                    aclList={this.context.work} permissionName="add"
                  >
                    <Link to="work/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="workList.addBtn"/>
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