import React, {Fragment} from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	Form, FormGroup, FormText, Input, Label
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import axios from 'axios'
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";

export default class UserUpdate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			user: null,
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
						user: result.data,
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

	handleSubmit(){
		console.log("test") // TODO!
	}

	componentDidMount() {
		const {REACT_APP_USERS_URL} = process.env;
		this.loadData(REACT_APP_USERS_URL + this.props.match.params.id + "/");
		return void 0;
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="userForm.title" />: {this.state.user.first_name} {this.state.user.last_name}</CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
							<Input
								name="mobileNumber"
								plaintext
								value={this.state.user.mobile_number}
								readOnly
							/>
						</FormGroup>
						<FormGroup>
							<Label for="firstName"><Text text="userForm.firstName"/></Label>
							<Input
								type="text"
								name="firstName"
								defaultValue={this.state.user.first_name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="lastName"><Text text="userForm.lastName"/></Label>
							<Input
								type="text"
								name="lastName"
								defaultValue={this.state.user.last_name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="email"><Text text="userForm.email"/></Label>
							<Input
								type="email"
								name="email"
								defaultValue={this.state.user.email}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="birthday"><Text text="userForm.birthDate"/></Label>
							<Input
								type="datetime"
								name="birthday"
								defaultValue={this.state.user.birth_date}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleFile"><Text text="userForm.avatar"/></Label>
							<Input type="file" name="file" />
							<FormText color="muted">
								{/*This is some placeholder block-level help text for the above*/}
								{/*input. It's a bit lighter and easily wraps to a new line.*/}
							</FormText>
						</FormGroup>
						<FormGroup>
							<Label for="theme"><Text text="userForm.theme"/></Label>
							<Input type="select" name="theme">
								<option value="LT">Light</option>
								<option value="DK">Dark</option>
							</Input>
						</FormGroup>
						<Link to="/user">
							<Button>
								Return
							</Button>
						</Link>
						<Button onClick={this.handleSubmit}>Submit</Button>
					</Form>
				</CardBody>
			</Fragment>
		)
	}

	render() {
		const {error, isLoaded} = this.state;
		if (error) {
			return <div><Text text="global.error"/>: {error.message}</div>;
		} else if (!isLoaded) {
			return (
				<div className="loaderWrapper text-center mt-4">
					<h3 className="text-center text-muted">
						<Text text="global.loading"/>
					</h3>
				</div>)
				;
		} else {

			return (
				<Container>
					<Card>
						{this.content()}
					</Card>
				</Container>
			);
		}
	}
};
