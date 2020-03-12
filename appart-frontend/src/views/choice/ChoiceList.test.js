import React from 'react';
import { shallow } from 'enzyme';
import ChoiceList from './choiceList';

it('renders without crashing', () => {
  shallow(<ChoiceList/>);
});