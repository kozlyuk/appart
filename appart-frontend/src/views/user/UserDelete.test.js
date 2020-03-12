import React from 'react';
import { shallow } from 'enzyme';
import UserDelete from './userDelete';

it('renders without crashing', () => {
  shallow(<UserDelete/>);
});