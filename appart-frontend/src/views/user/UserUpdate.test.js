import React from 'react';
import { shallow } from 'enzyme';
import UserUpdate from './userUpdate';

it('renders without crashing', () => {
  shallow(<UserUpdate/>);
});