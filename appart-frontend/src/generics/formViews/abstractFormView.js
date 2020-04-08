/*
 * Abstract form view
 *
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import axios from 'axios';
import Auth from '../../auth/auth';

export default class AbstractFormView extends React.Component {
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
   * Set data
   *
   * @param value
   */
  set dataUrl(value) {
    this._dataUrl = value;
  }

  /**
   * Get request type
   *
   * @return {*}
   */
  get requestType() {
    return this._requestType;
  }

  /**
   * Set request type
   *
   * @param value
   */
  set requestType(value) {
    this._requestType = value;
  }

  /**
   * Get post url
   *
   * @return {*}
   */
  get postUrl() {
    return this._postUrl;
  }

  /**
   * Set post url
   *
   * @param value
   */
  set postUrl(value) {
    this._postUrl = value;
  }

  /**
   * Get user
   *
   * @return {Auth}
   */
  get user() {
    return this._user;
  }

  /**
   * Set user
   *
   * @param value
   */
  set user(value) {
    this._user = value;
  }

  /**
   *
   * @param props
   * @param dataUrl
   * @param requestType
   * @param postUrl
   */
  constructor(props, dataUrl, requestType, postUrl) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      url: ''
    };
    this._user = new Auth();
    this._props = props;
    this._dataUrl = dataUrl;
    this._requestType = requestType;
    this._postUrl = postUrl;
  }

  loadData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      }
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

  submitData(target) {
    return void 0;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: this._requestType,
      url: this._postUrl,
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      },
      data: this.submitData(event.target)
    }).then(function(response) {
      console.log(response);
    })
      .catch(function(error) {
        console.log(error);
      });
  };

  update() {
    return void 0;
  }

  componentDidMount() {
    if (this._dataUrl) {
      if (this.props.match) {
        this.loadData(this._dataUrl + this.props.match.params.id + '/');

        this.setState({
          url: this._dataUrl + this.props.match.params.id + '/'
        });
      }
      return void 0;
    } else {
      console.log(this._dataUrl);
      this.setState({
        data: 'new',
        url: this._postUrl
      });
    }
    this.update();
  }
};
