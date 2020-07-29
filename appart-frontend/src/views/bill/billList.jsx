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
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import { Text } from 'react-easy-i18n';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import PageSpinner from '../../components/PageSpinner';
import BillFilter from './filter/BillFilter';
import PermissionComponent from '../../acl/PermissionComponent';
import { PermissionContext } from '../../globalContext/PermissionContext';
import axios from 'axios';
import BillController from '../../controllers/BillController';
import SelectWithChoices from '../../components/FormInputs/SelectWithChoices';
import Swal from 'sweetalert2';
import PrintContainer from './PrintContainer';
import styles from '../apartmentAnalytics/apartmentAnalytics.module.css';


export default class BillList extends AbstractListView {
  /**
   * Bill list constructor.
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      //paginator settings
      itemsCountPerPage: Number(process.env.REACT_APP_ITEMS_COUNT_PER_PAGE),
      pageRangeDisplayed: Number(process.env.REACT_APP_PAGE_RANGE_DISPLAYED),
      //paginator settings end
      searchQuery: '',
      houseQuery: '',
      serviceQuery: '',
      billsModalToggle: false,
      printModalToggle: false,
      resultPrintModal: false,
      resultPrintData: null,
      isActiveQuery: true
    };
    this.dataUrl = process.env.REACT_APP_BILLS;
    this.filterSearchHandler = this.filterSearchHandler.bind(this);
    this.BillController = new BillController();
  }

  static contextType = PermissionContext;

  componentDidMount() {
    super.componentDidMount();
    Promise.all(this.BillController.getCreateBillsValues())
      .then(axios.spread((
        houses,
        uomTypes
        ) => {
          this.setState({
            houses: houses.data,
            uomTypes: uomTypes.data
          });
        })
      );
  }

  /**
   * @return {string}
   */
  getQueryString() {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const isActiveQuery = this.state.isActiveQuery;
    this.dataUrl = `${process.env.REACT_APP_BILLS}?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&is_active=${isActiveQuery}`;

    return this.dataUrl;
  }

  /**
   * Paginator
   *
   * @param pageNumber
   */
  handlePageChange(pageNumber) {
    const searchQuery = this.state.searchQuery.toString().trim();
    const houseQuery = this.state.houseQuery.trim();
    const serviceQuery = this.state.serviceQuery.trim();
    const isActiveQuery = this.state.isActiveQuery;
    this.setState({ activePage: pageNumber });
    this.refreshData(
      pageNumber,
      `?filter=${searchQuery}&house=${houseQuery}&service=${serviceQuery}&is_active=${isActiveQuery}`
    );
  }

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
   * Filter for house select input.
   *
   * @param event
   */
  filterHouseHandler = (event) => {
    const selectValue = event.target.value.toString();
    this.setState({
      houseQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  /**
   * Filter for service select input.
   *
   * @param event
   */
  filterServiceHandler = (event) => {
    const selectValue = event.target.value.toString();
    this.setState({
      serviceQuery: selectValue
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  /**
   * Filter for is active checkbox.
   *
   * @param event
   */
  filterIsActiveHandler = (event) => {
    this.setState({
      isActiveQuery: !this.state.isActiveQuery
    }, () => {
      this.loadData(this.getQueryString());
    });
  };

  toggleBillsModal = () => {
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState({ billsModalToggle: !this.state.billsModalToggle });
  };

  togglePrintModal = () => {
    this.setState({ printModalToggle: !this.state.printModalToggle });
  };

  togglePrintResultModal = () => {
    this.setState({ resultPrintModal: !this.state.resultPrintModal });
  };

  createBills = (event) => {
    event.preventDefault();
    axios(this.getFormattedBillEndpoint(), {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(result => {
        Swal.fire({
          title: 'Успіх!',
          text: result.data,
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        })
          .then(result => {
            this.toggleModal();
          });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: error.response.data
        });
      });
  };

  onSelectChange = (event) => {
    const values = [...event.target.selectedOptions].map(opt => opt.value);
    this.setState({
      selectedHouses: values
    });
  };

  getFormattedBillEndpoint = () => {
    let createBillsEndpoint = process.env.REACT_APP_CREATE_BILLS;
    const uomType = document.getElementById('uom_type');
    this.state.selectedHouses.map((id, index) => {
      if (index === 0) {
        createBillsEndpoint += `?house=${id}`;
      } else {
        createBillsEndpoint += `&house=${id}`;
      }
    });

    createBillsEndpoint += `&uom_type=${uomType.value}`;

    return createBillsEndpoint;
  };

  printEndpoint = (house, period) => {
    let printEndpoint = process.env.REACT_APP_BILLS;
    return `${printEndpoint}?house=${house}&period=${period}&page_size=1000`;
  };

  printBills = (event) => {
    event.preventDefault();
    const form = document.getElementById('BillPrintForm');
    const formData = new FormData(form);
    const house = formData.get('house');
    const date = new Date().toISOString().slice(0, 10);
    axios(this.printEndpoint(house, date), {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
    })
      .then(response => {
        console.log(response);
        this.togglePrintModal();
        this.togglePrintResultModal();
        this.setState({
          resultPrintModal: true,
          resultPrintData: response.data.results
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: error.response.data
        });
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
          <th className={styles.withoutPadding}><Text text="billList.tableHeader.apartment"/></th>
          <th className={styles.withoutPadding}><Text text="billList.tableHeader.apartmentNumber"/></th>
          <th className={styles.withoutPadding}><Text text="billList.tableHeader.purpose"/></th>
          <th className={styles.withoutPadding}><Text text="billList.tableHeader.actions"/></th>
        </tr>
        </thead>
        <tbody>
        {this.state.data?.map((bill) => (
          <tr key={bill.pk} align="center">
            <td className={styles.withoutPadding}>{bill.apartment_name}</td>
            <td className={styles.withoutPadding}>{bill.number}</td>
            <td className={styles.withoutPadding}>{bill.purpose}</td>
            <td className={styles.withoutPadding} width="15%">
              <PermissionComponent
                aclList={this.context.bill} permissionName="view"
              >
                <Link to={`bill/${bill.pk}/edit`}>
                  <Badge color="warning" className="mr-1">
                    <Text text="billList.update"/>
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

  createBillsModal = () => (
    <Modal isOpen={this.state.billsModalToggle} toggle={this.toggleModal}>
      <ModalHeader toggle={this.toggleModal}>Формування рахунків</ModalHeader>
      <Form id={'BillCreateForm'} onSubmit={this.createBills}>
        <ModalBody>
          <FormGroup className="mt-3">
            <Label for="house">Будинок</Label>
            <Input
              required
              onChange={this.onSelectChange}
              type="select"
              name="house"
              id="house"
              size="15"
              multiple
            >
              {this.state.houses?.map(house => (
                <option key={house.pk} value={house.pk}>{house.name}</option>
              ))}
            </Input>
          </FormGroup>
          <SelectWithChoices
            label='Одиниця виміру'
            name="uom_type"
            id="uom_type"
          >
            {this.state.uomTypes?.map(uom => (
              <option key={uom[0]} value={uom[0]}>{uom[1]}</option>
            ))}
          </SelectWithChoices>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">Сформувати рахунки</Button>
          <Button color="secondary" onClick={() => this.toggleModal()}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  printBillsModal = () => (
    <Modal isOpen={this.state.printModalToggle} toggle={this.togglePrintModal}>
      <ModalHeader toggle={this.togglePrintModal}>Друк рахунків</ModalHeader>
      <Form id={'BillPrintForm'} onSubmit={this.printBills}>
        <ModalBody>
          <FormGroup className="mt-3">
            <Label for="house">Будинок</Label>
            <Input
              required
              onChange={this.onSelectChange}
              type="select"
              name="house"
              id="house"
            >
              {this.state.houses?.map(house => (
                <option key={house.pk} value={house.pk}>{house.name}</option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="primary">Згенерувати список</Button>
          <Button color="secondary" onClick={() => this.togglePrintModal()}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  printResultModal = () => (
    <Modal isOpen={this.state.resultPrintModal} toggle={this.togglePrintResultModal} size="xl">
      <ModalHeader toggle={this.togglePrintResultModal}>Друк рахунків</ModalHeader>
      <ModalBody>
        <PrintContainer data={this.state.resultPrintData}/>
        {/*{this.state.resultPrintData?.map(bill => (*/}
        {/*  <Receipt bill={bill}/>*/}
        {/*))}*/}
      </ModalBody>
    </Modal>
  );

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
          {this.createBillsModal()}
          {this.printBillsModal()}
          {this.printResultModal()}
          <BillFilter
            filterSearchHandler={this.filterSearchHandler}
            filterHouseHandler={this.filterHouseHandler}
            filterServiceHandler={this.filterServiceHandler}
            filterIsActiveHandler={this.filterIsActiveHandler}
            isLoaded
          />
          <Row>
            <Col>
              <Card className="mb-3">
                <CardHeader>
                  <Text text="sidebar.bills"/>
                  <PermissionComponent
                    aclList={this.context.bill} permissionName="add"
                  >
                    <div className="float-right">
                      <Button onClick={this.togglePrintModal} size="sm" color="primary" className="mr-2">
                        Друкувати рахунки
                      </Button>
                      <Button onClick={this.toggleBillsModal} size="sm" color="secondary" className="mr-2">
                        Сформувати рахунки
                      </Button>
                      <Link to="bill/new">
                        <Button size="sm" className="float-right" color="success">
                          <Text text="billList.addBtn"/>
                        </Button>
                      </Link>
                    </div>
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