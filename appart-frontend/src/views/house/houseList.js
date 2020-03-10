import AbstractListView from "../../generics/listViews/abstractListView";
import Page from 'components/Page';
import React from 'react';
import {
    Badge,
    Button,
    Card, CardBody, CardHeader,
    Col, Row,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import UserCard from "../../components/Card/UserCard";
import {Link} from "react-router-dom";
import Pagination from "react-js-pagination";


export default class HouseList extends AbstractListView {
    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.dataUrl = process.env.REACT_APP_HOUSES_URL
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
                    <th>#</th>
                    <th><Text text="houseList.tableHeader.housePhoto"/></th>
                    <th><Text text="houseList.tableHeader.houseName"/></th>
                    <th><Text text="houseList.tableHeader.houseAddress"/></th>
                    <th><Text text="houseList.tableHeader.apartmentsCount"/></th>
                    <th><Text text="houseList.tableHeader.actions"/></th>
                </tr>
                </thead>
                <tbody>
                {this.state.data.map((house) => (
                    <tr align="center">
                        <td width="2%">{house.pk}</td>
                        <td width="2%">
                            <img onClick={this.toggle()} style={{height: "30px", cursor: "pointer"}} src={house.logo} alt="avatar"/>
                        </td>
                        <td>{house.name}</td>
                        <td>{house.address}</td>
                        <td>{house.apartments_count}</td>
                        <td width="15%">
                            <Link to={`house/${house.pk}/edit`}>
                                <Badge color="warning" className="mr-1">
                                    <Text text="houseList.tableHeader.editBtn"/>
                                </Badge>
                            </Link>
                            <Link to={`house/${house.pk}/delete`}>
                                <Badge color="danger" className="mr-1">
                                    <Text text="houseList.tableHeader.deleteBtn"/>
                                </Badge>
                            </Link>
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
                                            height: 300,
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
        )
    }

    /**
     *
     * @returns {*}
     */
    render() {
        const {error, isLoaded} = this.state;
        if (error) {
            return <div><Text text="global.error" />: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div className="loaderWrapper text-center mt-4">
                    <h3 className="text-center text-muted"><Text text="global.loading" /></h3>
                </div>)
                ;
        } else {

            return (
                <Page
                    breadcrumbs={[{name: <Text text="sidebar.house"/>, active: true}]}
                    className="TablePage"
                >
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader>
                                    <Text text="sidebar.house"/>
                                    <Link to="/house/new">
                                        <Button size="sm" className="float-right" color="success">
                                            <Text text="houseList.addBtn"/>
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
            )
        }
    }
}