import React from "react";
import axios from "axios";

export default class AbstractDetailView extends React.Component {
  /**
   *
   * @param props
   * @param dataUrl
   */
  constructor(props, dataUrl) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null
    };
    this.dataUrl = dataUrl;
  }

  /**
   * Load data from ajax
   *
   * @param dataUrl
   */
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
            data: result.data
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

  /**
   *
   * @returns {*}
   */
  componentDidMount() {
    this.loadData(this.dataUrl + this.props.match.params.id + "/");
    return void 0;
  }
}
