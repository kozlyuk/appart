import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";

export default class UserNew extends AbstractFormView{
	constructor(props) {
		super(props);
		this.dataUrl = undefined
	}

	handleSubmit(){
		console.log("new user")
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="userForm.newUser.title" /></CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="mobileNumber"><Text text="userForm.mobileNumber"/></Label>
							<Input
								name="mobileNumber"
								type="number"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="firstName"><Text text="userForm.firstName"/></Label>
							<Input
								type="text"
								name="firstName"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="lastName"><Text text="userForm.lastName"/></Label>
							<Input
								type="text"
								name="lastName"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="email"><Text text="userForm.email"/></Label>
							<Input
								type="email"
								name="email"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="birthday"><Text text="userForm.birthDate"/></Label>
							<Input
								type="datetime"
								name="birthday"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="exampleFile"><Text text="userForm.avatar"/></Label>
							<Input type="file" name="file" />
							<FormText color="muted">
							</FormText>
						</FormGroup>
						<Link to="/user">
							<Button color="warning">
								<Text text="buttons.returnBtn"/>
							</Button>
						</Link>
						<Button className="float-right" onClick={this.handleSubmit}>
							<Text text="buttons.submitBtn"/>
						</Button>
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