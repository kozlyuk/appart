import React from 'react';
import { shallow } from 'enzyme';
import HouseList from './houseList';

it('renders without crashing', () => {
  shallow(<HouseList/>);
});