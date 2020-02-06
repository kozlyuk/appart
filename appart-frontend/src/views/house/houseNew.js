import React, {Fragment} from "react"
import AbstractFormView from "../../generics/formViews/abstractFormView";
import {Card, CardBody, CardHeader, Form, FormGroup, FormText, Input, Label} from "reactstrap";
import {Text} from "react-easy-i18n";
import {Link} from "react-router-dom";
import Button from "reactstrap/es/Button";
import Container from "reactstrap/es/Container";

export default class HouseNew extends AbstractFormView{
	constructor(props) {
		super(props);
		this.dataUrl = undefined
	}

	handleSubmit(){
		console.log("new house")
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="houseForm.newHouse.title" /></CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="name"><Text text="houseForm.name"/></Label>
							<Input
								type="text"
								name="name"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="address"><Text text="houseForm.address"/></Label>
							<Input
								type="text"
								name="address"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="photo"><Text text="houseForm.photo"/></Label>
							<Input type="file" name="file" />
							<FormText color="muted" />
						</FormGroup>
						<FormGroup>
							<Label for="description"><Text text="houseForm.description"/></Label>
							<Input
								type="textarea"
								name="description"
							/>
						</FormGroup>
						<FormGroup>
							<Label for="apartmentCount"><Text text="houseForm.apartmentCount"/></Label>
							<Input
								type="number"
								name="apartmentCount"
								min="0"
							/>
						</FormGroup>

						<Link to="/house">
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