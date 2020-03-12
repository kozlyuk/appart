import React from 'react';
import { shallow } from 'enzyme';
import UserList from './list';

it('renders without crashing', () => {
  shallow(<UserList/>);
});