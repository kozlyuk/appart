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


export default class UserList extends AbstractListView {
	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_USERS_URL
	}

	content() {
		return (
			<Table responsive>
				<thead>
				<tr align="center">
					<th>#</th>
					<th><Text text="userList.tableHeader.avatar"/></th>
					<th><Text text="userList.tableHeader.firstName"/></th>
					<th><Text text="userList.tableHeader.lastName"/></th>
					{/*<th><Text text="userList.tableHeader.birthDate"/></th>*/}
					<th><Text text="userList.tableHeader.actions"/></th>
				</tr>
				</thead>
				<tbody>
				{this.state.data.map((user) => (
					<tr align="center">
						<td width="2%">{user.pk}</td>
						<td width="2%">
							<img onClick={this.toggle()} style={{height: "30px", cursor: "pointer"}} src={user.avatar} alt="avatar"/>
						</td>
						<td>{user.first_name}</td>
						<td>{user.last_name}</td>
						{/*<td>{user.birth_date}</td>*/}
						<td width="15%">
							<Link to={`user/${user.pk}/edit`}>
								<Badge color="warning" className="mr-1">
									<Text text="userList.tableHeader.editBtn"/>
								</Badge>
							</Link>
							<Link to={`user/${user.pk}/delete`}>
								<Badge color="danger" className="mr-1">
									<Text text="userList.tableHeader.deleteBtn"/>
								</Badge>
							</Link>
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
											height: 300,
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
					breadcrumbs={[{name: <Text text="sidebar.user"/>, active: true}]}
					className="TablePage"
				>
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
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Page>
			)
		}
	}
}