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
import { Text } from 'react-easy-i18n';
import UserCard from '../../components/Card/UserCard';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import UserFilter from './filter/UserFilter';
import PageSpinner from '../../components/PageSpinner';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';
import styles from '../apartmentAnalytics/apartmentAnalytics.module.css';


export default class UserList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED)
      //paginator settings end
    };
    this.dataUrl = process.env.REACT_APP_USERS_URL;
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
          <th className={styles.withoutPadding}><Text text="userList.tableHeader.firstName"/></th>
          <th className={styles.withoutPadding}><Text text="userList.tableHeader.lastName"/></th>
          <th className={styles.withoutPadding}><Text text="userList.tableHeader.isActive"/></th>
          <th className={styles.withoutPadding}><Text text="userList.tableHeader.isPersonal"/></th>
          {/*<th><Text text="userList.tableHeader.birthDate"/></th>*/}
          <th className={styles.withoutPadding}><Text text="userList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((user) => (
          <tr key={user.pk} align="center">
            <td className={styles.withoutPadding}>{user.first_name}</td>
            <td className={styles.withoutPadding}>{user.last_name}</td>
            <td className={styles.withoutPadding}>
              {user.is_active ?
                <FaCheck className="text-success"/>
                :
                <MdClose className="text-danger"/>
              }
            </td>
            <td className={styles.withoutPadding}>
              {user.is_staff ?
                <FaCheck className="text-success"/>
                :
                <MdClose className="text-danger"/>
              }
            </td>
            {/*<td>{user.birth_date}</td>*/}
            <td className={styles.withoutPadding} width="15%">
              <PermissionComponent
                aclList={this.context.user} permissionName="change"
              >
                <Link to={`user/${user.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="userList.tableHeader.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{user.first_name} {user.last_name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={user.avatar}
                    title={user.first_name}
                    subtitle={user.last_name}
                    text={user.email}
                    style={{
                      height: 300
                    }}
                  >
                    <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                      {user.mobile_number ?
                        <CardText><Text text="userDetail.mobileNumber"/> : {user.mobile_number}</CardText> : <></>}

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
          <UserFilter
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={true}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.user"/>
                  <PermissionComponent
                    aclList={this.context.user} permissionName="add"
                  >
                    <Link to="user/new">
                      <Button size="sm" className="float-right" color="success">
                        <Text text="userList.addBtn"/>
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