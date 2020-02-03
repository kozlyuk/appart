import {registerLang, setCurrentLocale} from 'react-easy-i18n';

registerLang('en',{
	global: {
		loading: 'Loading...',
		error: 'Error'
	},
	sidebar: {
		home: 'home',
		user: 'users',
		company: 'company',
		condominium: 'condominium',
		notice: 'notice',
		payment: 'payment',
		profile: 'profile'
	},
	userList: {
		tableHeader: {
			firstName: "First name",
			lastName: "Last name",
			avatar: "Avatar image",
			birthDate: "Birth date",
			actions: "Actions",
			editBtn: "Edit",
			deleteBtn: "Delete"
		}
	},
	userForm: {
		title: "User",
		firstName: "First Name",
		lastName: "Last Name",
		mobileNumber: "Mobile number",
		email: "Email",
		birthDate: "Birth date",
		avatar: "Avatar image",
		theme: "Theme",
	},
	userDetail: {
		mobileNumber: "Mobile number"
	},
	user: 'User'
});
registerLang('ua', {
	global: {
		loading: 'Завантаження...',
		error: 'Помилка'
	},
	sidebar: {
		home: 'головна',
		user: 'користувачі',
		company: 'компанія',
		condominium: 'кондомініум',
		notice: 'оголошення',
		payment: 'платежі',
		profile: 'профіль'
	},
	userList: {
		tableHeader: {
			firstName: "Ім'я",
			lastName: "Прізвище",
			avatar: "Аватар",
			birthDate: "Дата народження",
			actions: "Дії",
			editBtn: "Редагувати",
			deleteBtn: "Видалити"
		}
	},
	userForm: {
		title: "Користувач",
		firstName: "Ім'я",
		lastName: "Прізвище",
		mobileNumber: "Номер телефону",
		email: "Електронна пошта",
		birthDate: "Дата народження",
		avatar: "Аватар",
		theme: "Тема",
	},
	userDetail: {
		mobileNumber: "Номер телефону"
	},
});

setCurrentLocale('ua');