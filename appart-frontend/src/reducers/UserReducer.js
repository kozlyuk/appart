/*
 * @author          Andrey Perestyuk (Arrathilar)
 * @email-primary   a.perestyuk@itel.rv.ua
 * @email-secondary arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 * @copyright       2020 ITEL-Service
 */

import React from "react";
import { createContext, useReducer, useContext } from "react";

/**
 * Action Types
 *
 * @type {string}
 */
const SET_USER = 'SET_USER';

/**
 * Define a context and a reducer for updating context
 *
 * @type {React.Context<unknown>}
 */
const GlobalStateContext = createContext();

/**
 *
 * @type {{user: {is_staff: null, pk: null, apartments: []}}}
 */
const initialState = {
	user: {
		pk: null,
		is_staff: null,
		apartments: []
	}
};

/**
 *
 * @param state
 * @param action
 * @returns {{user}|*}
 */
const globalStateReducer = (state, action) => {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				user: { ...action.payload }
			};
		default:
			return state;
	}
};

/**
 * Export a component to provide the context to its children
 * This is used to wrap our top-level component in our app
 *
 * @param children
 * @returns {*}
 * @constructor
 */
export const GlobalStateProvider = ({children}) => {
	const [state, dispatch] = useReducer(globalStateReducer, initialState);

	return (
		<GlobalStateContext.Provider value={[state, dispatch]}>
			{children}
		</GlobalStateContext.Provider>
	);
};

/**
 * Default export is a hook that provides a simple API for updating the global state.
 * This also allows us to keep all of this state logic in this one file
 *
 * @returns {{setUser: setUser, user: any}}
 */
const useGlobalState = () => {
	const [state, dispatch] = useContext(GlobalStateContext);

	const setUser = ({ pk, is_staff, apartments }) => {
		dispatch({ type: SET_USER, payload: { pk, is_staff, apartments } });
	};

	return {
		setUser,
		user: { ...state.user },
	};
};

export default useGlobalState;