import React, {Fragment} from 'react';
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from 'reactstrap';
import {Text} from "react-easy-i18n";
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";
import AbstractFormView from "../../generics/formViews/abstractFormView";

// ugly regular expression for validate length of phone number
const validPhoneRegex = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
// ugly regular expression for validate email
const validEmailRegex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const validateForm = (errors) => {
	let valid = true;
	Object.values(errors).forEach(
		(val) => val.length > 0 && (valid = false)
	);
	return valid;
};

export default class UserUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.state = {
			// validation fields
			password: '',
			mobileNumber: '',
			// defaultInactiveBtn: true,
			errors: {
				mobileNumber: '',
				first_name: '',
				last_name: '',
				email: '',
				birthday: '',
				avatar: '',
			}
		};
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
		if (target.file.files[0]) {
			userFormData.append("avatar", target.file.files[0]);
		}
		return userFormData;
	}

	/*
	 * Form field validation
	 * handleChange(event): void
	 *
	 * check field valid and
	 * set errors str to state
	 **/
	handleChange = (event) => {
		event.preventDefault();
		const { name, value } = event.target;
		let errors = this.state.errors;
		this.setState({errors, ['defaultInactiveBtn']: false});
		console.log(event)
		switch (name) {
			case 'mobileNumber':
				errors.mobileNumber =
					(validPhoneRegex.test(value) && value.length === 10)
						? ''
						: [<Text text="global.validateErrors.mobileNumber"/>];
				break;
			case 'password':
				errors.password =
					value.length < 6
						? [<Text text="global.validateErrors.password"/>]
						: '';
				break;
			case 'firstName':
				errors.first_name =
					value.length < 1
						? [<Text text="global.validateErrors.first_name"/>]
						: '';
				break;
			case 'lastName':
				errors.last_name =
					value.length < 1
						? [<Text text="global.validateErrors.last_name"/>]
						: '';
				break;
			case 'email':
				errors.email =
					validEmailRegex.test(value)
						? ''
						: [<Text text="global.validateErrors.email"/>];
				break;
			default:
				break;
		}

		this.setState({errors, [name]: value});
	};


	content() {
		return (
			<Fragment>
				<CardHeader><Text text="userForm.title" />: {this.state.data.first_name} {this.state.data.last_name}</CardHeader>
				<CardBody>
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
							{this.state.errors.mobileNumber.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
							<Input
								name="mobileNumber"
								plaintext
								value={this.state.data.mobile_number}
								onChange={this.handleChange}
								readOnly
							/>
						</FormGroup>
						<FormGroup>
							<Label for="firstName"><Text text="userForm.firstName"/></Label>
							{this.state.errors.first_name.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.first_name}</FormText>}
							<Input
								type="text"
								name="firstName"
								defaultValue={this.state.data.first_name}
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="lastName"><Text text="userForm.lastName"/></Label>
							{this.state.errors.last_name.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.last_name}</FormText>}
							<Input
								type="text"
								name="lastName"
								defaultValue={this.state.data.last_name}
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="email"><Text text="userForm.email"/></Label>
							{this.state.errors.email.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.email}</FormText>}
							<Input
								type="email"
								name="email"
								defaultValue={this.state.data.email}
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="birthday"><Text text="userForm.birthDate"/></Label>
							{this.state.errors.birthday.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.birthday}</FormText>}
							<Input
								type="date"
								name="birthday"
								defaultValue={this.state.data.birth_date}
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleFile"><Text text="userForm.avatar"/></Label>
							{this.state.errors.avatar.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.avatar}</FormText>}
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
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						{ this.state.defaultInactiveBtn ||
						this.state.errors.mobileNumber ||
						this.state.errors.first_name ||
						this.state.errors.last_name ||
						this.state.errors.email ||
						this.state.errors.birthday ||
						this.state.errors.avatar ?
							<Button disabled className="float-right">
								<Text text="buttons.submitBtn"/>
							</Button>:<Button className="float-right" type="submit">
								<Text text="buttons.submitBtn"/>
							</Button>
						}
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
