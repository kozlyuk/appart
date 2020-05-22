/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import React from 'react';
import { Button, Col, FormFeedback, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class SelectWithButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _triggerDeleteModal(id) {
    Swal.fire({
      title: 'Дійсно бажаєте видалити виконавця?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Ні',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Так!'
    }).then((result) => {
      if (result.value) {
        this._sendDeleteRequest(id);
      }
    });
  }

  /**
   * Send delete request.
   *
   * @param id
   * @private
   */
  _sendDeleteRequest = (id) => {
    if (id) {
      axios({
        method: 'delete',
        url: `${process.env.REACT_APP_EXECUTIONS}${id}/`,
        headers: {
          'Authorization': 'Token ' + this.props.token
        }
      })
        .then(success => {
          this.props.callback(this.props.index);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.props.callback(this.props.index);
    }
  };

  render() {
    return (
      <FormGroup>
        <Label for={this.props.name}>{this.props.label}</Label>
        <Row>
          <Col xl="10" className="mb-0">
            <Input
              {...this.props}
              invalid={!!this.props.error}
              onChange={this.props.changeHandler}
              name={this.props.name}
              id={this.props.name}
              type="select"
            >
              {this.props.children}
            </Input>
            <FormFeedback>{this.props.error}</FormFeedback>
          </Col>
          <Col className="mb-0">
            <Button className="btn-danger" style={{ width: '100%' }}
                    onClick={() => this._triggerDeleteModal(this.props.id)}>{this.props.buttonText}</Button>
          </Col>
        </Row>
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>}
      </FormGroup>
    );
  }
}