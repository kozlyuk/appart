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
		house: 'house',
		apartment: 'apartment',
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
	houseList: {
		addBtn: "Add new house",
		tableHeader: {
			housePhoto: "House photo",
			houseName: "House name",
			houseAddress: "House address",
			apartmentsCount: "Apartments count",
			actions: "Actions",
			editBtn: "Edit",
			deleteBtn: "Delete"
		}
	},
	houseDelete: {
		text: "Are you sure you want to remove house"
	},
	houseForm: {
		title: "House",
		name: "Name",
		address: "Address",
		photo: "Photo",
		description: "Description",
		apartmentCount: "Apartments count",
		newHouse: {
			title: "Новий будинок",
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
		deleteBtn: "Delete",
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
		house: 'будинок',
		apartment: 'апартаменти',
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
	houseList: {
		addBtn: "Додати новий будинок",
		tableHeader: {
			housePhoto: "Фото будинку",
			houseName: "Ім'я будинку",
			houseAddress: "Адреса будинку",
			apartmentsCount: "Кількість апартаментів",
			actions: "Дії",
			editBtn: "Редагувати",
			deleteBtn: "Видалити"
		}
	},
	houseForm: {
		title: "Будинок",
		name: "Ім'я",
		address: "Адреса",
		photo: "Фото",
		description: "Опис",
		apartmentCount: "Кількість апартаментів",
		newHouse: {
			title: "Новий будинок",
		}
	},
	houseDelete: {
		text: "Дійсно бажаєте видалити будинок"
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
		deleteBtn: "Видалити",
	}
});

setCurrentLocale('ua');