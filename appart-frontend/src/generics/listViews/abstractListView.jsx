import React from "react"
import axios from 'axios'
import Auth from "../../auth/auth";

export default class AbstractListView extends React.Component{
	dataUrl;
	constructor(props, dataUrl) {
		super(props);
		this.state = {
			isLoaded: false,
			data: null,
			modal: false,
			modal_backdrop: false,
			modal_nested_parent: false,
			modal_nested: false,
			backdrop: true,
		};
		dataUrl = this.dataUrl
		this.user = new Auth();
	}

	loadData(dataUrl) {
		axios(dataUrl, {
			headers: {
				"Authorization": "Token " + this.user.getAuthToken()
			}
		})
			.then(
				result => {
					this.setState({
						isLoaded: true,
						data: result.data,
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
		this.loadData(this.dataUrl);
		return void 0;
	}
}