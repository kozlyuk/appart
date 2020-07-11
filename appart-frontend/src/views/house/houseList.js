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
  CustomInput,
  Form,
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
import HouseFilter from './filter/HouseFilter';
import { PermissionContext } from '../../globalContext/PermissionContext';
import PermissionComponent from '../../acl/PermissionComponent';
import SelectWithChoices from '../order/components/SelectWithChoices';
import axios from 'axios';
import HouseController from '../../controllers/HouseController';


export default class HouseList extends AbstractListView {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isActive: true,
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
      //paginator settings end
      billsModalToggle: false
    };
    this.dataUrl = process.env.REACT_APP_HOUSES_URL;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
    this.HouseController = new HouseController();
  }

  static contextType = PermissionContext;

  componentDidMount() {
    super.componentDidMount();
    Promise.all(this.HouseController.getUomValues())
      .then(axios.spread((
        uom
        ) => {
          this.setState({
            uomTypes: uom.data
          });
        })
      );
  }

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

  toggleAllCheckboxes = () => {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach((checkbox) => {
      this.toggleCheckboxChecked(checkbox);
    });
  };

  toggleCheckboxChecked(checkbox) {
    checkbox.checked = !checkbox.checked;
  }

  toggleBills = () => {
    const checkboxes = document.querySelectorAll('.checkbox');
    let billsCreateQuery = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked && !billsCreateQuery.includes(checkbox.value)) {
        billsCreateQuery.push(checkbox.value);
      }
    });
    this.setState({
      billsCreateQuery: billsCreateQuery
    }, this.toggleBillsModal);
  };

  toggleBillsModal() {
    this.getHousesById();
    this.toggleModal();
  }

  toggleModal = () => {
    this.setState({
      billsModalToggle: !this.state.billsModalToggle
    });
  };

  getHousesById = () => {
    const houseArray = [];
    this.state.data.map(house => {
      if (this.state.billsCreateQuery.includes(house.pk.toString())) {
        houseArray.push(house);
      }
    });
    this.setState({
      houseForBills: houseArray
    }, () => {
      this.setState({
        checkedHouses: this.isHouseListExist()
      });
    });
  };

  isHouseListExist = () => {
    return !!this.state.houseForBills[0];
  };

  getBills = () => {
    const endpoint = this.getFormattedBillEndpoint();
    axios({
      method: 'get',
      url: endpoint
    })
      .then(response => {
        this.setState({
          bills: response.data
        });
      });
  };

  getFormattedBillEndpoint = () => {
    let createBillsEndpoint = process.env.REACT_APP_CREATE_BILLS;
    this.state.billsCreateQuery.map((id, index) => {
      if (index === 0) {
        createBillsEndpoint += `?house=${id}`;
      } else {
        createBillsEndpoint += `&house=${id}`;
      }
    });
    const uomType = document.getElementById('uom_type').value;
    const isActive = this.state.isActive >>> 0;
    createBillsEndpoint += `&uom_type=${uomType}`;
    createBillsEndpoint += `&is_active=${isActive}`;

    return createBillsEndpoint;
  };

  switchToggler = () => {
    this.setState({
      isActive: !this.state.isActive
    });
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
          <th width="1%"><input type="checkbox" size="sm" onChange={this.toggleAllCheckboxes}/></th>
          <th><Text text="houseList.tableHeader.housePhoto"/></th>
          <th><Text text="houseList.tableHeader.houseName"/></th>
          <th><Text text="houseList.tableHeader.houseAddress"/></th>
          <th><Text text="houseList.tableHeader.apartmentsCount"/></th>
          <th><Text text="houseList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data.map((house) => (
          <tr key={house.pk} align="center">
            <td><input value={house.pk} type="checkbox"
                       size="sm"
                       className="mt-auto mb-auto ml-0 checkbox"/></td>
            <td width="2%">
              <img onClick={this.toggle()} style={{ height: '20px', cursor: 'pointer' }} src={house.logo} alt="avatar"/>
            </td>
            <td>{house.name}</td>
            <td>{house.address}</td>
            <td>{house.apartments_count}</td>
            <td width="15%">
              <PermissionComponent
                aclList={this.context.house} permissionName="change"
              >
                <Link to={`house/${house.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="houseList.tableHeader.editBtn"/>
                  </Badge>
                </Link>
              </PermissionComponent>
            </td>

            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle()}
              className={this.props.className}>
              <ModalHeader toggle={this.toggle()}>{house.name}</ModalHeader>
              <ModalBody>
                <Col md={12}>
                  <UserCard
                    avatar={house.logo}
                    title={house.name}
                    subtitle={house.address}
                    text={house.description}
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
          <Modal isOpen={this.state.billsModalToggle} toggle={this.state.billsModalToggle}>
            <ModalHeader toggle={this.toggleModal}>Формування рахунків</ModalHeader>
            <ModalBody>
              {this.state.checkedHouses ?
                <>
                  <Table responsive>
                    <thead>
                    <tr align="center">
                      <th>Ім'я будинку</th>
                      <th>Адреса</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.houseForBills && this.state.houseForBills.map(item => (
                      <tr align="center">
                        <td>{item.name}</td>
                        <td>{item.address}</td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                  <Form id={'createBills'}>
                    <Row form>
                      <Col md={12}>
                        <SelectWithChoices
                          label={'Одиниця виміру'}
                          name={'uom_type'}
                          id={'uom_type'}
                        >
                          {this.state.uomTypes.map(uom => (
                            <option value={uom[0]}>{uom[1]}</option>
                          ))}
                        </SelectWithChoices>
                        <div className="mx-auto">
                          <CustomInput
                            type="switch"
                            id="isActive"
                            name="isActive"
                            checked={this.state.isActive}
                            onChange={() => this.switchToggler(this, 'is_active')}
                            label="Тільки активні"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </>
                :
                <span>
                Оберіть будинок
                </span>
              }
            </ModalBody>
            <ModalFooter>
              {this.state.checkedHouses &&
              <Button color="primary" onClick={() => this.getBills()}>Сформувати рахунки</Button>
              }
              <Button color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <HouseFilter
            filterSearchHandler={this.filterSearchHandler}
            isLoaded={true}
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.house"/>
                  <div className="float-right">
                    <Button onClick={this.toggleBills} size="sm" color="secondary" className="mr-2">
                      Сформувати рахунки
                    </Button>
                    <PermissionComponent
                      aclList={this.context.choice} permissionName="add"
                    >
                      <Link to="house/new">
                        <Button size="sm" color="success">
                          <Text text="houseList.addBtn"/>
                        </Button>
                      </Link>
                    </PermissionComponent>
                  </div>
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