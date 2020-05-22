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
  }

  /**
   * Date picker handle change.
   *
   * @param value
   * @param formattedValue
   */
  _handleChange(value, formattedValue) {

  }

  render() {
    return (
      <FormGroup>
        <Label>{this.props.label}</Label>
        <DatePicker id={this.props.name} name={this.props.name}
                    showClearButton={false}
                    value={this.props.value}
                    onChange={this._handleChange}/>
        {this.props.helpText &&
        <FormText>{this.props.helpText}</FormText>
        }
      </FormGroup>
    );
  }
}