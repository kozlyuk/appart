import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import {Text} from 'react-easy-i18n';
import UserCard from '../../components/Card/UserCard';
import {Link} from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PaymentFilter from './filter/PaymentFilter';
import PageSpinner from "../../components/PageSpinner";


export default class PaymentList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataUrl = process.env.REACT_APP_PAYMENT;
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
          <th><Text text="paymentList.tableHeader.avatar"/></th>
          <th><Text text="paymentList.tableHeader.firstName"/></th>
          <th><Text text="paymentList.tableHeader.lastName"/></th>
          <th><Text text="paymentList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((payment) => (
          <tr key={payment.pk} align="center">
            <td width="2%">
              <img onClick={this.toggle()} style={{height: '30px', cursor: 'pointer'}} src={payment.avatar}
                   alt="avatar"/>
            </td>
            <td>{payment.first_name}</td>
            <td>{payment.last_name}</td>
            {/*<td>{user.birth_date}</td>*/}
            <td width="15%">
              <Link to={`payment/${payment.pk}/edit`}>
                <Badge color="warning" className="mr-1">
                  <Text text="userList.tableHeader.editBtn"/>
                </Badge>
              </Link>
              <Link to={`payment/${payment.pk}/delete`}>
                <Badge color="danger" className="mr-1">
                  <Text text="userList.tableHeader.deleteBtn"/>
                </Badge>
              </Link>
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{payment.first_name} {payment.last_name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={payment.avatar}
                    title={payment.first_name}
                    subtitle={payment.last_name}
                    text={payment.email}
                    style={{
                      height: 300
                    }}
                  >
                    <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                      {payment.mobile_number ?
                        <CardText><Text text="userDetail.mobileNumber"/> : {payment.mobile_number}</CardText> : <></>}

                    </CardBody>
                  </UserCard>
                </Col>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.toggle()}>
                  <Text text="buttons.closeBtn"/>
                </Button>
              </ModalFooter>
            </Modal>
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
          breadcrumbs={[{name: <Text text="sidebar.user"/>, active: true}]}
          className="TablePage"
        >
          <PaymentFilter
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={true}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.user"/>
                  <Link to="/user/new">
                    <Button size="sm" className="float-right" color="success">
                      <Text text="userList.addBtn"/>
                    </Button>
                  </Link>
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