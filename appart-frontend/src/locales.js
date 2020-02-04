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
		addBtn: "Add new user",
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
		newUser: {
			title: "New user",
		}
	},
	userDetail: {
		mobileNumber: "Mobile number"
	},
	buttons: {
		submitBtn: "Save",
		returnBtn: "Return",
		closeBtn: "Close",
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
		addBtn: "Додати нового користувача",
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
		newUser: {
			title: "Новий користувач",
		}
	},
	userDetail: {
		mobileNumber: "Номер телефону"
	},
	buttons: {
		submitBtn: "Зберегти",
		returnBtn: "Назад",
		closeBtn: "Закрити",
	}
});

setCurrentLocale('ua');