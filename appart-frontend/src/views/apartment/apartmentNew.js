import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";

export default class ApartmentNew extends AbstractFormView{
	constructor(props) {
		super(props);
		this.dataUrl = undefined
	}

	handleSubmit(){
		console.log("new apartment")
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="apartmentForm.newApartment.title" /></CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="house"><Text text="apartmentForm.house"/></Label>
							<Input
								type="text"
								name="house"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="number"><Text text="apartmentForm.number"/></Label>
							<Input
								type="number"
								name="number"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="area"><Text text="apartmentForm.area"/></Label>
							<Input
								type="number"
								name="area"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="residentCount"><Text text="apartmentForm.residentCount"/></Label>
							<Input
								type="number"
								name="residentCount"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="apartmentForm.description"/></Label>
							<Input
								type="textarea"
								name="description"
							/>
						</FormGroup>

						<Link to="/apartment">
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