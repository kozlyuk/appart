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
import { FaCheck } from 'react-icons/fa';
import { Text } from 'react-easy-i18n';
import UserCard from '../../components/Card/UserCard';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApartmentFilter from './filter/ApartmentFilter';
import { MdClose } from 'react-icons/md';


export default class ApartmentList extends AbstractListView {
  constructor(props) {
    super(props);
    this.state = {
      isFilterActive: true
    };
    this.filterUrl = process.env.REACT_APP_HOUSES_URL;
    this.dataUrl = process.env.REACT_APP_APARTMENTS_URL;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
    this.filterSelectHandler = this.filterSelectHandler.bind(this);
  }

  filterSearchHandler(event) {
    const queryName = event.target.getAttribute('filterquery');
    const searchValue = event.target.value.toString();
    if (searchValue.length > 3) {
      this.loadData(`${this.dataUrl}?${queryName}=${searchValue}`);
    }
  }

  filterSelectHandler(event) {
    const queryName = event.target.getAttribute('filterquery');
    const selectValue = event.target.value.toString();
    this.loadData(`${this.dataUrl}?${queryName}=${selectValue}`);
  }

  content() {
    return (
      <Table responsive>
        <thead>
        <tr align="center">
          <th><Text text="apartmentList.tableHeader.number"/></th>
          <th><Text text="apartmentList.tableHeader.house"/></th>
          <th><Text text="apartmentList.tableHeader.resident"/></th>
          <th><Text text="apartmentList.tableHeader.actions"/></th>
          <th width="2%"><Text text="apartmentList.tableHeader.isActive"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((apartment) => (
          <tr key={apartment.pk} align="center">
            <td width="2%">{apartment.number}</td>
            <td>{apartment.house}</td>
            {apartment.resident ? <td>{apartment.resident[1]}</td>
              : <td><Text text="apartmentList.emptyApartment"/></td>}

            <td width="15%">
              <Link to={`apartment/${apartment.pk}/edit`}>
                <Badge color="warning" className="mr-1">
                  <Text text="apartmentList.tableHeader.editBtn"/>
                </Badge>
              </Link>
              <Link to={`apartment/${apartment.pk}/delete`}>
                <Badge color="danger" className="mr-1">
                  <Text text="apartmentList.tableHeader.deleteBtn"/>
                </Badge>
              </Link>
            </td>
            <td>
              {apartment.is_active ?
                <FaCheck className="text-success"/>
                :
                <MdClose className="text-danger"/>
              }
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{apartment.name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={apartment.logo}
                    title={apartment.name}
                    subtitle={apartment.address}
                    text={apartment.description}
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

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div><Text text="global.error"/>: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loaderWrapper text-center mt-4">
          <h3 className="text-center text-muted"><Text text="global.loading"/></h3>
        </div>)
        ;
    } else {

      return (
        <Page
          breadcrumbs={[{ name: <Text text="sidebar.apartment"/>, active: true }]}
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
                  <Link to="/apartment/new">
                    <Button size="sm" className="float-right" color="success">
                      <Text text="apartmentList.addBtn"/>
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