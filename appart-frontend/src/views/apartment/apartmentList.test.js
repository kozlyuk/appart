import React from 'react';
import { shallow } from 'enzyme';
import ApartmentList from './apartmentList';

it('renders without crashing', () => {
  shallow(<ApartmentList/>);
});