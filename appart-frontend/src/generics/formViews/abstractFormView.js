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
import Swal from 'sweetalert2';

/**
 * Abstract form class
 */
export default class AbstractFormView extends React.Component {
  /**
   * Get success redirect url
   *
   * @return {*}
   */
  get successRedirect() {
    return this._successRedirect;
  }

  /**
   * Set success redirect url
   *
   * @param value
   */
  set successRedirect(value) {
    this._successRedirect = value;
  }

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
   * Abstract form constructor
   *
   * @param props
   * @param dataUrl
   * @param requestType
   * @param postUrl
   * @param successRedirect
   * @param successButton
   */
  constructor(props, dataUrl, requestType, postUrl, successRedirect, successButton) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      url: '',
      fieldError: ''
    };
    this._user = new Auth();
    this._props = props;
    this._dataUrl = dataUrl;
    this._requestType = requestType;
    this._postUrl = postUrl;
    this._successRedirect = successRedirect;
    this._successButton = successButton;
    this.handleSubmit.bind(this);
  }

  secondaryLoadData() {
  }

  /**
   * Load data
   *
   * @param dataUrl
   */
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

  /**
   * Submit data wrapper
   *
   * @param target
   * @return {*}
   */
  submitData(target) {
    return void 0;
  }

  /**
   * Handle submit
   *
   * @param event
   */
  handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: this._requestType,
      url: this._postUrl,
      headers: {
        'Authorization': 'Token ' + this._user.getAuthToken()
      },
      data: this.submitData(event.target)
    }).then((response) => {
      let successMessage = '';
      if (typeof response.data == 'string') {
        successMessage = response.data;
      }
      Swal.fire({
        title: 'Успіх!',
        text: successMessage,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: this._successButton
      }).then((result) => {
        if (result.value) {
          this.props.history.push(this._successRedirect);
        }
      });
    })
      .catch((error) => {
        console.log(error);
        this.setState({
          fieldError: error.response.data
        });
        let errorArr = [];
        for (let i in error.response.data) {
          errorArr.push(error.response.data[i]);
        }
        const errorString = (errorArr.map(item => {
          const errorValue = item[0].toString();
          console.log(errorValue);
          return (`<div>${errorValue}</div>`);
        }));
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          html: errorString.join('')
        });
      });
  };

  /**
   * Update wrapper
   *
   * @return {*}
   */
  update() {
    return void 0;
  }

  /**
   *
   * @return {*}
   */
  componentDidMount() {
    this.secondaryLoadData();
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
