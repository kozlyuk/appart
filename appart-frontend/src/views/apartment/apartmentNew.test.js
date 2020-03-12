import React from 'react';
import { shallow } from 'enzyme';
import ApartmentNew from './apartmentNew';

it('renders without crashing', () => {
  shallow(<ApartmentNew/>);
});