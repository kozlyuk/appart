/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */
import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

export default class SelectWithChoices extends React.Component {
  render() {
    return (
      <FormGroup>
        <Label for={this.props.name}>{this.props.label}</Label>
        <Input
          onChange={this.props.changeHandler}
          name={this.props.name}
          id={this.props.name}
          type="select"
        >
          {this.props.children}
        </Input>
      </FormGroup>
    );
  }
}