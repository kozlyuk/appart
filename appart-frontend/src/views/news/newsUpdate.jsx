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

export default class NewsUpdate extends AbstractFormView {
	/**
	 *
	 * @param props
	 */
	constructor(props) {
		super(props);
		this.dataUrl = process.env.REACT_APP_NEWS_URL
	}

	/**
	 *
	 * @returns {*}
	 */
	content() {
		return (
			<Fragment>
				<CardHeader><Text text="newsForm.title" />: {this.state.data.title}</CardHeader>
				<CardBody>
					<Form>
						<FormGroup>
							<Label for="title"><Text text="newsForm.title"/></Label>
							<Input
								type="text"
								name="title"
								defaultValue={this.state.data.title}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="house"><Text text="newsForm.houses"/></Label>
							<Input
								type="text"
								name="house"
								defaultValue={this.state.data.houses}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="status"><Text text="newsForm.status"/></Label>
							<Input
								type="text"
								name="status"
								defaultValue={this.state.data.news_status}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="text"><Text text="newsForm.text"/></Label>
							<Input
								type="textarea"
								name="text"
								defaultValue={this.state.data.text}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="actualFrom"><Text text="newsForm.actualFrom"/></Label>
							<Input
								type="date"
								name="actualFrom"
								defaultValue={this.state.data.actual_from}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="actualTo"><Text text="newsForm.actualTo"/></Label>
							<Input
								type="date"
								name="actualTo"
								defaultValue={this.state.data.actual_to}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="picture"><Text text="newsForm.picture"/></Label>
							<Input type="file" name="file" />
							<FormText color="muted" />
						</FormGroup>


						<Link to="/news">
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

	/**
	 *
	 * @returns {*}
	 */
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
