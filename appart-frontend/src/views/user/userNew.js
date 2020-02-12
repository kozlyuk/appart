import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";

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

export default class UserNew extends AbstractFormView{
	constructor(props) {
		super(props);
		this.state = {
			// validation fields
			password: '',
			mobileNumber: '',
			// defaultInactiveBtn: true,
			errors: {
				mobileNumber: true,
				first_name: '',
				last_name: '',
				email: true,
				birthday: '',
				avatar: '',
			}
		};
		this.dataUrl = undefined;
		this.postUrl = process.env.REACT_APP_USERS_URL;
		this.requestType = "post"
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

	handleSubmit(){
		console.log("new user")
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
				<CardHeader><Text text="userForm.newUser.title" /></CardHeader>
				<CardBody>
					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
							{this.state.errors.mobileNumber.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.mobileNumber}</FormText>}
							<Input
								name="mobileNumber"
								type="number"
								onChange={this.handleChange}
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
								onChange={this.handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleFile"><Text text="userForm.avatar"/></Label>
							{this.state.errors.avatar.length > 0 &&
							// error field
							<FormText color="danger">{this.state.errors.avatar}</FormText>}
							<Input type="file" name="file" onChange={this.handleChange} />
							<FormText color="muted">
							</FormText>
						</FormGroup>
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
		return (
			<Container>
				<Card>
					{this.content()}
				</Card>
			</Container>
		);
	}
}