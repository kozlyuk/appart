import React, {Fragment} from 'react';
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from 'reactstrap';
import {Text} from "react-easy-i18n";
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";
import AbstractFormView from "../../generics/formViews/abstractFormView";

export default class UserUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_USERS_URL;
		this.requestType = "put"
	}

	submitData(target){
		const userFormData = new FormData();
		// dict of all elements
		userFormData.append("mobile_number", target.mobileNumber.value);
		userFormData.append("first_name", target.firstName.value);
		userFormData.append("last_name", target.lastName.value);
		userFormData.append("email", target.email.value);
		userFormData.append("birthday", target.birthday.value);
		userFormData.append("avatar", target.file.files[0]);
		return userFormData;
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="userForm.title" />: {this.state.data.first_name} {this.state.data.last_name}</CardHeader>
				<CardBody>
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
							<Input
								name="mobileNumber"
								plaintext
								value={this.state.data.mobile_number}
								readOnly
							/>
						</FormGroup>
						<FormGroup>
							<Label for="firstName"><Text text="userForm.firstName"/></Label>
							<Input
								type="text"
								name="firstName"
								defaultValue={this.state.data.first_name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="lastName"><Text text="userForm.lastName"/></Label>
							<Input
								type="text"
								name="lastName"
								defaultValue={this.state.data.last_name}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="email"><Text text="userForm.email"/></Label>
							<Input
								type="email"
								name="email"
								defaultValue={this.state.data.email}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="birthday"><Text text="userForm.birthDate"/></Label>
							<Input
								type="datetime"
								name="birthday"
								defaultValue={this.state.data.birth_date}
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
						{/*<FormGroup>*/}
						{/*	<Label for="theme"><Text text="userForm.theme"/></Label>*/}
						{/*	<Input type="select" name="theme">*/}
						{/*		<option value="LT">Light</option>*/}
						{/*		<option value="DK">Dark</option>*/}
						{/*	</Input>*/}
						{/*</FormGroup>*/}
						<Link to="/user">
							<Button color="warning">
								Return
							</Button>
						</Link>
						<Button className="float-right" type="submit">Submit</Button>
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
