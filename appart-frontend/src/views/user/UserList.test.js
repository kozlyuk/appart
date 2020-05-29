import React from 'react';
import { shallow } from 'enzyme';
import UserList from './UserList';

it('renders without crashing', () => {
  shallow(<UserList/>);
});