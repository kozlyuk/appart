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
import {Badge, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import {Text} from 'react-easy-i18n';
import {Link} from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PageSpinner from '../../components/PageSpinner';
import BillFilter from "./filter/BillFilter";


export default class BillList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = process.env.REACT_APP_BILLS;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
  }

  /**
   * Search handler
   *
   * @param event
   */
  filterSearchHandler(event) {
    const queryName = event.target.getAttribute('filterquery');
    const searchValue = event.target.value.toString();
    if (searchValue.length > 3) {
      this.loadData(`${this.dataUrl}?${queryName}=${searchValue}`);
    }
  }

  /**
   *
   * @returns {*}
   */
  content() {
    return (
      <Table responsive>
        <thead>
        <tr align="center">
          <th width="2%">Apartment</th>
          <th>Number</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((bill) => (
          <tr key={bill.pk} align="center">
            <td>{bill.apartment}</td>
            <td>{bill.number}</td>
            <td width="15%">
              <Link to={`bill/${bill.pk}/edit`}>
                <Badge color="warning" className="mr-1">
                  Details
                </Badge>
              </Link>
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
        </div>)
        ;
    } else {
      return (
        <Page
          breadcrumbs={[{name: <Text text="sidebar.bills"/>, active: true}]}
          className="TablePage"
        >
          <BillFilter
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={true}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.bills"/>
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