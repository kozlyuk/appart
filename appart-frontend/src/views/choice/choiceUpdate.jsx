import React, {Fragment} from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	Form, FormGroup, FormText, Input, Label
} from 'reactstrap';
import {Text} from "react-easy-i18n";
import Container from "reactstrap/es/Container";
import Button from "reactstrap/es/Button";
import {Link} from "react-router-dom";
import AbstractFormView from "../../generics/formViews/abstractFormView";

export default class ChoiceUpdate extends AbstractFormView {

	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_CHOICES_URL
	}

	content() {
		return (
			<Fragment>
				<CardHeader><Text text="choiceForm.title" />: {this.state.data.choice_text}</CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="choiceText"><Text text="choiceForm.choiceText"/></Label>
							<Input
								type="textarea"
								name="choiceText"
								defaultValue={this.state.data.choice_text}
							/>
						</FormGroup>

						<Link to="/choice">
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
