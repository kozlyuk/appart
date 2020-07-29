import AbstractListView from '../../generics/listViews/abstractListView';
import Page from 'components/Page';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import UserCard from '../../components/Card/UserCard';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PageSpinner from '../../components/PageSpinner';
import HouseFilter from './filter/OrderFilter';
import { MdFiberManualRecord } from 'react-icons/md';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';
import styles from '../apartmentAnalytics/apartmentAnalytics.module.css';


export default class OrderList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED)
      //paginator settings end
    };
    this.dataUrl = process.env.REACT_APP_ORDER;
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
    const queryName = event.target.search.getAttribute('filterquery');
    const searchValue = event.target.search.value.toString();
    this.loadData(`${this.dataUrl}?${queryName}=${searchValue}`);
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
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.apartment"/></th>
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.execStatus"/></th>
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.payStatus"/></th>
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.warning"/></th>
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.workName"/></th>
          <th className={styles.withoutPadding}><Text text="orderList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((order) => (
          <tr key={order.pk} align="center">
            <td className={styles.withoutPadding}>{order.apartment_name}</td>
            {order.exec_status === 'New' ?
              <td className={styles.withoutPadding}>
                <MdFiberManualRecord
                  color={'#45b649'}
                  style={{ marginBottom: '2px' }}
                  size={12}
                /> {order.exec_status}
              </td> :
              <td className={styles.withoutPadding}>{order.exec_status}</td>}
            <td className={styles.withoutPadding}>{order.pay_status}</td>
            <td className={styles.withoutPadding}>{order.warning}</td>
            <td className={styles.withoutPadding}>{order.work_name}</td>
            <td className={styles.withoutPadding} width="15%">
              <PermissionComponent
                aclList={this.context.order} permissionName="change"
              >
                <Link to={`order/${order.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="orderList.tableHeader.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{order.name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={order.logo}
                    title={order.name}
                    subtitle={order.address}
                    text={order.description}
                    style={{
                      height: 300
                    }}
                  >
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
          <HouseFilter
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={true}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.order"/>
                  <PermissionComponent
                    aclList={this.context.order} permissionName="add"
                  >
                    <Link to="order/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="orderList.addBtn"/>
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