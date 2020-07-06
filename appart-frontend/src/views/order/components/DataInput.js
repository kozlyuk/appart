/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from 'react';
import { FormGroup, FormText, Label } from 'reactstrap';
import DatePicker from 'reactstrap-date-picker';

export default class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      formattedValue: this.props.startValue,
      value: this.props.startValue
    };
  }

  handleChange(value, formattedValue) {
    const withDash = formattedValue.replace(/\//mg, '-');
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: withDash // Formatted String, ex: "11/19/2016"
    });
  }

  render() {
    return (
      <FormGroup>
        <input type={'hidden'} value={this.state.formattedValue} name={this.props.name + '-formatted'}/>
        <Label>{this.props.label}</Label>
        <DatePicker
          id={this.props.name} name={this.props.name}
          value={this.state.value}
          showClearButton={false}
          dateFormat={'YYYY/MM/DD'}
          onChange={(v, f) => this.handleChange(v, f)}
          {...this.props}
        />
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>
        }
      </FormGroup>
    );
  }
}