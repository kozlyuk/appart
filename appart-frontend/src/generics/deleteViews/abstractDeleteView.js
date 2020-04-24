import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class AbstractDeleteView extends React.Component {
  
  submitHandler() {
    axios({
      method: 'delete',
      url: `${this.dataUrl + this.props.match.params.id}/`,
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
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
        confirmButtonText: this.successButton
      }).then((result) => {
        if (result.value) {
          this.props.history.push(this.successRedirect);
        }
      });
    });
  }

  /**
   *
   * @param dataUrl
   */
  loadData(dataUrl) {
    axios(dataUrl, {
      headers: {
        'Authorization': 'Token ' + this.user.getAuthToken()
      }
    }).then(
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
}