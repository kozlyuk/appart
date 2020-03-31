import { registerLang, setCurrentLocale } from 'react-easy-i18n';

registerLang('en', {
  global: {
    loading: 'Loading...',
    error: 'Error',
    validateErrors: {
      emptyField: 'The field can not be empty!',
      incorrectNumber: 'Please enter the correct quantity!',
      mobileNumber: 'Phone number should be 10 digits long!',
      password: 'Password must be 6 characters long!',
      first_name: 'The field cannot be empty!',
      last_name: 'The field cannot be empty!',
      house: 'The field cannot be empty!',
      email: 'Email is invalid!',
      pictureExtension: 'Valid file extension: JPG, JPEG or PNG!',
      pictureSize: 'Please choose file less 5Mb',
      houseApartmentsCount: 'Please enter the correct quantity!',
      apartmentNumber: 'Please enter the correct number!',
      apartmentArea: 'The area should be different from 0!'
    }
  },
  sidebar: {
    home: 'home',
    user: 'users',
    company: 'company',
    condominium: 'condominium',
    house: 'house',
    apartment: 'apartment',
    notice: 'notice',
    choice: 'choice',
    news: 'news',
    question: 'question',
    payment: 'payment',
    bills: 'bills',
    profile: 'profile'
  },
  userList: {
    addBtn: 'Add new user',
    tableHeader: {
      firstName: 'First name',
      lastName: 'Last name',
      avatar: 'Avatar image',
      birthDate: 'Birth date',
      actions: 'Actions',
      editBtn: 'Edit',
      deleteBtn: 'Delete'
    }
  },
  houseList: {
    addBtn: 'Add new house',
    tableHeader: {
      housePhoto: 'House photo',
      houseName: 'House name',
      houseAddress: 'House address',
      apartmentsCount: 'Apartments count',
      actions: 'Actions',
      editBtn: 'Edit',
      deleteBtn: 'Delete'
    }
  },
  houseDelete: {
    text: 'Are you sure you want to remove house'
  },
  houseForm: {
    title: 'House',
    name: 'Name',
    address: 'Address',
    photo: 'Photo',
    description: 'Description',
    apartmentCount: 'Apartments count',
    newHouse: {
      title: 'Новий будинок'
    }
  },
  userForm: {
    title: 'User',
    firstName: 'First Name',
    lastName: 'Last Name',
    mobileNumber: 'Mobile number',
    email: 'Email',
    birthDate: 'Birth date',
    avatar: 'Avatar image',
    theme: 'Theme',
    newUser: {
      title: 'New user'
    }
  },
  userDetail: {
    mobileNumber: 'Mobile number'
  },
  apartmentList: {
    addBtn: 'Add new apartment',
    emptyApartment: 'Apartment empty',
    tableHeader: {
      number: 'Apartment number',
      house: 'House',
      area: 'Area',
      resident: 'Resident',
      actions: 'Actions',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      isActive: 'Active'
    }
  },
  apartmentForm: {
    title: 'Apartment',
    house: 'House',
    number: 'Apartment number',
    area: 'Area',
    residentCount: 'Resident count',
    description: 'description',
    newApartment: {
      title: 'New apartment'
    }
  },
  apartmentDelete: {
    text: 'Are you sure you want to remove apartment'
  },
  choiceList: {
    addBtn: 'Add new choice ',
    tableHeader: {
      choiceText: 'Choice text',
      votes: 'Votes',
      actions: 'Actions',
      editBtn: 'Edit',
      deleteBtn: 'Delete'
    }
  },
  choiceDelete: {
    text: 'Are you sure you want to remove choice'
  },
  choiceForm: {
    title: 'Choice',
    choiceText: 'Text',
    newChoice: {
      title: 'New choice'
    }
  },
  newsList: {
    addBtn: 'Add news',
    tableHeader: {
      title: 'Title',
      status: 'Status',
      actualTime: 'Actual time',
      actions: 'Actions',
      editBtn: 'Edit',
      deleteBtn: 'Delete'
    }
  },
  newsForm: {
    title: 'News title',
    houses: 'Houses',
    status: 'News status',
    text: 'News text',
    actualFrom: 'Actual from',
    actualTo: 'Actual to',
    picture: 'Picture',
    newNews: {
      title: 'New news'
    }
  },
  newsDelete: {
    text: 'Are you sure you want to remove news'
  },
  buttons: {
    submitBtn: 'Save',
    returnBtn: 'Return',
    closeBtn: 'Close',
    deleteBtn: 'Delete'
  },
  user: 'User'
});
registerLang('ua', {
  global: {
    loading: 'Завантаження...',
    error: 'Помилка',
    validateErrors: {
      emptyField: 'Поле не може бути пустим!',
      incorrectNumber: 'Вкажіть вірну кількість!',
      mobileNumber: 'Номер телефону повинен складатися з 10 символів!',
      password: 'Пароль повинен бути довшим за 6 символів!',
      first_name: 'Поле не може бути пустим!',
      last_name: 'Поле не може бути пустим!',
      house: 'Поле не може бути пустим!',
      pictureExtension: 'Допустимі розширення файлу: JPG, JPEG or PNG!',
      pictureSize: 'Будь ласка виберіть файл менше 5Mb',
      email: 'Введіть вірний формат електронної пошти!',
      houseApartmentsCount: 'Вкажіть вірну кількість!',
      apartmentNumber: 'Вкажіть корректний номер!',
      apartmentArea: 'Площа має бути відмінною від 0!'
    }
  },
  sidebar: {
    home: 'головна',
    user: 'користувачі',
    company: 'компанія',
    condominium: 'домогосподарство',
    house: 'будинок',
    apartment: 'апартаменти',
    notice: 'оголошення',
    choice: 'варіанти вибору',
    news: 'новини',
    question: 'запитання',
    payment: 'платежі',
    bills: 'рахунки',
    profile: 'профіль'
  },
  userList: {
    addBtn: 'Додати нового користувача',
    tableHeader: {
      firstName: 'Ім\'я',
      lastName: 'Прізвище',
      avatar: 'Аватар',
      birthDate: 'Дата народження',
      actions: 'Дії',
      editBtn: 'Редагувати',
      deleteBtn: 'Видалити'
    }
  },
  houseList: {
    addBtn: 'Додати новий будинок',
    tableHeader: {
      housePhoto: 'Фото будинку',
      houseName: 'Ім\'я будинку',
      houseAddress: 'Адреса будинку',
      apartmentsCount: 'Кількість апартаментів',
      actions: 'Дії',
      editBtn: 'Редагувати',
      deleteBtn: 'Видалити'
    }
  },
  houseForm: {
    title: 'Будинок',
    name: 'Ім\'я',
    address: 'Адреса',
    photo: 'Фото',
    description: 'Опис',
    apartmentCount: 'Кількість апартаментів',
    newHouse: {
      title: 'Новий будинок'
    }
  },
  houseDelete: {
    text: 'Дійсно бажаєте видалити будинок'
  },
  userForm: {
    title: 'Користувач',
    firstName: 'Ім\'я',
    lastName: 'Прізвище',
    mobileNumber: 'Номер телефону',
    email: 'Електронна пошта',
    birthDate: 'Дата народження',
    avatar: 'Аватар',
    theme: 'Тема',
    newUser: {
      title: 'Новий користувач'
    }
  },
  userDetail: {
    mobileNumber: 'Номер телефону'
  },
  apartmentList: {
    addBtn: 'Додати апартаменти',
    emptyApartment: 'Житель відсутній',
    tableHeader: {
      number: 'Номер апартаментів',
      house: 'Будинок',
      area: 'Площа',
      resident: 'Житель',
      actions: 'Дії',
      editBtn: 'Редагувати',
      deleteBtn: 'Видалити',
      isActive: 'Активні'
    }
  },
  apartmentForm: {
    title: 'Апартаменти',
    house: 'Будинок',
    number: 'Номер апартаментів',
    area: 'Площа',
    residentCount: 'Кількість жителів',
    description: 'Описання',
    newApartment: {
      title: 'Нові апартаменти'
    }
  },
  apartmentDelete: {
    text: 'Дійсно бажаєте видалити апартаменти'
  },
  choiceList: {
    addBtn: 'Додати варіант вибору ',
    tableHeader: {
      choiceText: 'Текст запитання',
      votes: 'Кількість голосів',
      actions: 'Дії',
      editBtn: 'Редагувати',
      deleteBtn: 'Видалити'
    }
  },
  choiceDelete: {
    text: 'Дійсно бажаєте видалити варіант вибору'
  },
  choiceForm: {
    title: 'Варіант вибору',
    choiceText: 'Текст',
    newChoice: {
      title: 'Новий варіант вибору'
    }
  },
  newsList: {
    addBtn: 'Додати новину',
    tableHeader: {
      title: 'Заголовок',
      status: 'Статус',
      actualTime: 'Актуальний час',
      actions: 'Дії',
      editBtn: 'Редагувати',
      deleteBtn: 'Видалити'
    }
  },
  newsForm: {
    title: 'Заголовок новини',
    houses: 'Будинок',
    status: 'Статус новини',
    text: 'Текст новини',
    actualFrom: 'Актуальна з',
    actualTo: 'Актуальна до',
    picture: 'Картинка',
    newNews: {
      title: 'Нова новина'
    }
  },
  newsDelete: {
    text: 'Дійсно бажаєте видалити новину'
  },
  buttons: {
    submitBtn: 'Зберегти',
    returnBtn: 'Назад',
    closeBtn: 'Закрити',
    deleteBtn: 'Видалити'
  }
});

setCurrentLocale('ua');