/*
 * Abstract detail view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import axios from 'axios';

export default class AbstractDetailView extends React.Component {
  /**
   * Get props
   *
   * @return {*}
   */
  get props() {
    return this._props;
  }

  /**
   * Set props
   *
   * @param value
   */
  set props(value) {
    this._props = value;
  }

  /**
   * Get data url
   *
   * @return {*}
   */
  get dataUrl() {
    return this._dataUrl;
  }

  /**
   * Set data url
   *
   * @param value
   */
  set dataUrl(value) {
    this._dataUrl = value;
  }

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
    this._props = props;
    this._dataUrl = dataUrl;
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
    this.loadData(this._dataUrl + this.props.match.params.id + '/');
    return void 0;
  }
}
