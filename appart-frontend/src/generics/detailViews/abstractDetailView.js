import React from "react"
import axios from "axios";

export default class AbstractDetailView extends React.Component {
	constructor(props, dataUrl) {
		super(props);
		this.state = {
			isLoaded: false,
			data: null,
		};
		this.dataUrl = dataUrl
	}

	loadData(dataUrl) {
		axios(dataUrl, {
			// headers: {
			// 	"Authorization": "Token " + this.authToken
			// }
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

	componentDidMount() {
		this.loadData(this.dataUrl + this.props.match.params.id + "/");
		return void 0;
	}
}
