import Page from 'components/Page';
import React from 'react';
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader, CardImg, CardText,
	Col,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Table
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import axios from 'axios'
import UserCard from "../../components/Card/UserCard";
import {Link} from "react-router-dom";

export default class UserList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			users: null,
			modal: false,
			modal_backdrop: false,
			modal_nested_parent: false,
			modal_nested: false,
			backdrop: true,
		}
	}

	loadData(url) {
		axios(url, {
			// headers: {
			// 	"Authorization": "Token " + this.authToken
			// }
		})
			.then(
				result => {
					this.setState({
						isLoaded: true,
						users: result.data,
					});
				},
				error => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			);
	}

	toggle = modalType => () => {
		if (!modalType) {
			return this.setState({
				modal: !this.state.modal,
			});
		}

		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`],
		});
	};

	componentDidMount() {
		const {REACT_APP_USERS_URL} = process.env;
		this.loadData(REACT_APP_USERS_URL);
		return void 0;
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
					<th><Text text="userList.tableHeader.birthDate"/></th>
					<th><Text text="userList.tableHeader.actions"/></th>
				</tr>
				</thead>
				<tbody>
				{this.state.users.map((user) => (
					<tr align="center">
						<td width="2%" scope="row">{user.pk}</td>
						<td width="2%" scope="row">
							<img onClick={this.toggle()} style={{height: "30px", cursor: "pointer"}} src={user.avatar}></img>
						</td>
						<td scope="row">{user.first_name}</td>
						<td scope="row">{user.last_name}</td>
						<td scope="row">{user.birth_date}</td>
						<td width="15%">
							<Link to={`user/${user.pk}/edit/`}>
								<Badge color="warning" className="mr-1">
									<Text text="userList.tableHeader.editBtn"/>
								</Badge>
							</Link>
							<Badge to="#" color="danger" className="mr-1">
								<Text text="userList.tableHeader.deleteBtn"/>
							</Badge>
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
											{user.mobile_number ? <CardText><Text text="userDetail.mobileNumber"/> : {user.mobile_number}</CardText>: <></> }

										</CardBody>
									</UserCard>
								</Col>
							</ModalBody>
							<ModalFooter>
								<Button color="secondary" onClick={this.toggle()}>
									Закрити
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
			return <div>Помилка: {error.message}</div>;
		} else if (!isLoaded) {
			return (
				<div className="loaderWrapper text-center mt-4">
					<h3 className="text-center text-muted">Завантаження...</h3>
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
								</CardHeader>
								<CardBody>
									{this.content()}
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Page>
			);
		}
	}
};
