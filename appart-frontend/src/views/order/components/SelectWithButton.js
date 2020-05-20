/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import React from 'react';
import { Button, Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import axios from 'axios';

export default class SelectWithButton extends React.Component {
  constructor(props) {
    super(props);
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
              onChange={this.props.changeHandler}
              name={this.props.name}
              id={this.props.name}
              type="select"
            >
              {this.props.children}
            </Input>
          </Col>
          <Col className="mb-0">
            <Button className="btn-danger" style={{ width: '100%' }}
                    onClick={() => this._sendDeleteRequest(this.props.id)}>{this.props.buttonText}</Button>
          </Col>
        </Row>
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>}
      </FormGroup>
    );
  }
}