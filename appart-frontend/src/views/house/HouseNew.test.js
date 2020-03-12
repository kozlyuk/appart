import React from 'react';
import { shallow } from 'enzyme';
import HouseNew from './houseNew';

it('renders without crashing', () => {
  shallow(<HouseNew/>);
});