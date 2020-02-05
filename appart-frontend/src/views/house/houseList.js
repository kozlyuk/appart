import AbstractListView from "../../generics/listViews/abstractListView";
import Page from 'components/Page';
import React from 'react';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader, CardText,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import UserCard from "../../components/Card/UserCard";
import {Link} from "react-router-dom";


export default class HouseList extends AbstractListView {
    constructor(props) {
        super(props);
        this.dataUrl = process.env.REACT_APP_HOUSES_URL
    }

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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Page>
            )
        }
    }
}