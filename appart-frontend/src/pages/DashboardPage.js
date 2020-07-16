import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import UserProgressTable from 'components/UserProgressTable';
import { NumberWidget } from 'components/Widget';
import { productsData, userProgressTableData } from 'demos/dashboardPage';
import React from 'react';
import { MdPersonPin } from 'react-icons/md';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { getColor } from 'utils/colors';
import DashboardController from '../controllers/DashboardController';
import axios from 'axios';
import PageSpinner from '../components/PageSpinner';

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7
);

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.DashboardController = new DashboardController();
  }

  state = {
    isLoaded: false,
    registeredResidents: null,
    activeApartments: null,
    debt: null,
    payments: null
  };


  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    Promise.all(this.DashboardController.getDashboardValues())
      .then(axios.spread((
        registeredResidents,
        activeApartments,
        debt,
        payments
      ) => {
        this.setState({
          isLoaded: true,
          registeredResidents: registeredResidents.data,
          activeApartments: activeApartments.data,
          debt: debt.data,
          payments: payments.data
        });
      }));
  }

  getPercentValue(total, value) {
    return (Math.floor((value / total) * 100));
  }

  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    if (this.state.isLoaded) {
      return (
        <Page
          className="DashboardPage"
          // title="Dashboard"
          // breadcrumbs={[{ name: 'Dashboard', active: true }]}
        >
          <Row>
            <Col lg={3} md={6} sm={6} xs={12}>
              <NumberWidget
                title={this.state.registeredResidents.label}
                // subtitle="This month"
                number={this.state.registeredResidents.data}
                color="secondary"
                progress={{
                  value: this.getPercentValue(this.state.registeredResidents.data_all, this.state.registeredResidents.data),
                  label: `Загально: ${this.state.registeredResidents.data_all}`
                }}
              />
            </Col>

            <Col lg={3} md={6} sm={6} xs={12}>
              <NumberWidget
                title={this.state.activeApartments.label}
                // subtitle="This month"
                number={this.state.activeApartments.data}
                color="secondary"
                progress={{
                  value: this.getPercentValue(this.state.activeApartments.data_all, this.state.activeApartments.data),
                  label: `Загально: ${this.state.activeApartments.data_all}`
                }}
              />
            </Col>

            <Col lg={3} md={6} sm={6} xs={12}>
              <NumberWidget
                title={this.state.debt.label}
                // subtitle="This month"
                number={this.state.debt.data}
                color="secondary"
                // progress={{
                //   value: this.getPercentValue(this.state.debt.data_all, this.state.debt.data),
                //   label: `Загально: ${this.state.debt.data_all}`
                // }}
              />
            </Col>

            <Col lg={3} md={6} sm={6} xs={12}>
              <NumberWidget
                title={this.state.payments.label}
                // subtitle="This month"
                number={this.state.payments.data}
                color="secondary"
                progress={{
                  value: this.getPercentValue(this.state.payments.data_all, this.state.payments.data),
                  label: `Загально: ${this.state.payments.data_all}`
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col md="6" sm="12" xs="12">
              <Card>
                <CardHeader>New Products</CardHeader>
                <CardBody>
                  {productsData.map(
                    ({ id, image, title, description, right }) => (
                      <ProductMedia
                        key={id}
                        image={image}
                        title={title}
                        description={description}
                        right={right}
                      />
                    )
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col md="6" sm="12" xs="12">
              <Card>
                <CardHeader>New Users</CardHeader>
                <CardBody>
                  <UserProgressTable
                    headers={[
                      <MdPersonPin size={25}/>,
                      'name',
                      'date',
                      'participation',
                      '%'
                    ]}
                    usersData={userProgressTableData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Page>
      );
    } else {
      return (<PageSpinner/>);
    }
  }
}

export default DashboardPage;
