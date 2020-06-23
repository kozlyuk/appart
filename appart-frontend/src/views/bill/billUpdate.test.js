import React from 'react';
import { shallow } from 'enzyme';
import BillForm from './billForm';

it('renders without crashing', () => {
  shallow(<BillForm/>);
});