import { registerFormatters, registerLang } from 'react-easy-i18n';

registerFormatters({
  firstUppercase: text => text.charAt(0).toUpperCase() + text.slice(1),
  exclamation: text => text + '!'
});

registerLang('en', {
  global: {
    loading: 'Loading...',
    error: 'Error',
    search: 'Search',
    filter: 'Filter',
    displayInactive: 'Display inactive',
    welcomeNotification: 'Welcome to Dim Online!',
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
      apartmentArea: 'The area should be different from 0!',
      description: 'Description field cannot be empty!'
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
    profile: 'profile',
    service: 'service',
    order: 'orders',
    work: 'work\'s'
  },
  paymentList: {
    tableHeader: {
      apartment: 'Apartment',
      value: 'Value',
      actions: 'Actions'
    }
  },
  paymentForm: {
    header: 'Payment for apartment:',
    apartment: 'Apartment',
    paymentType: 'Payment type',
    date: 'Date',
    value: 'Value',
    purpose: 'Purpose:'
  },
  userList: {
    addBtn: 'Add new user',
    tableHeader: {
      firstName: 'First name',
      lastName: 'Last name',
      avatar: 'Avatar image',
      birthDate: 'Birth date',
      isActive: 'Active',
      isPersonal: 'Personal',
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
  orderList: {
    tableHeader: {
      apartment: 'Apartment',
      execStatus: 'Execution status',
      payStatus: 'Pay status',
      warning: 'Warning',
      workName: 'Work name',
      actions: 'Actions',
      editBtn: 'Edit'
    },
    addBtn: 'Add order'
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
    permissions: 'Permissions',
    isActive: 'Active',
    isActiveHelpText: 'The user will have access to the personal page',
    isStaff: 'Staff',
    isStaffHelpText: 'The user will have access to admin page',
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
    resident: 'Resident number',
    residentCount: 'Resident count',
    description: 'Description',
    successUserAddMessage: 'If you save the form, the user with the number :user will be added to the apartment.',
    newApartment: {
      title: 'New apartment'
    }
  },
  apartmentDelete: {
    text: 'Are you sure you want to remove apartment'
  },
  phoneChecker: {
    number: 'User phone number',
    placeholder: 'Enter the phone number of the resident to link him to the apartment',
    addUser: 'Add user to apartment',
    userDoesNotExist: 'User with number :user is not in the database.',
    check: 'Check'
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
  workList: {
    tableHeader: {
      title: 'Works',
      name: 'Work name',
      priceCode: 'Price code',
      price: 'Price',
      duration: 'Duration',
      actions: 'Actions'
    },
    emptyDuration: 'Duration empty',
    addBtn: 'Add work'
  },
  workForm: {
    name: 'Work',
    priceCode: 'Price code',
    price: 'Price',
    description: 'Description',
    duration: 'Duration'
  },
  newsDelete: {
    text: 'Are you sure you want to remove news'
  },
  billList: {
    tableHeader: {
      apartment: 'Apartment',
      apartmentNumber: 'Number',
      purpose: 'Purpose',
      actions: 'Actions'
    },
    addBtn: 'Add bill',
    detail: 'Detail'
  },
  billForm: {
    apartment: 'Apartment',
    apartmentNumber: 'Number',
    totalValue: 'Total value',
    period: 'Period',
    purpose: 'Purpose'
  },
  orderForm: {
    newOrderHeader: 'New order',
    house: 'House',
    houseHelpText: 'To select an apartment number, first select a house',
    apartment: 'Apartment',
    work: 'Work',
    execStatus: 'Execution status',
    payStatus: 'Pay status',
    information: 'Information',
    informationHelpText: 'Additional comment',
    warning: 'Comment',
    executorsSet: {
      header: 'Executors',
      executor: 'Executor',
      scheduledTime: 'Sheduled time',
      scheduledTimeHelpText: 'Scheduled end time'
    },
    selectValues: {
      apartment: 'Apartment №: :number',
      resident: 'Resident:'
    },
    description: 'Description'
  },
  cabinet: {
    debt: 'Debt',
    house: 'House',
    company: 'Company',
    userCard: {
      administration: 'Administration',
      profile: 'My profile',
      cabinet: 'Cabinet',
      logOut: 'Log out'
    },
    sidebar: {
      notifications: 'Notifications',
      bills: 'Bills',
      payments: 'Payments',
      services: 'Services'
    },
    billCard: {
      pay: 'Pay',
      billNumber: 'Bill number',
      billDate: 'Bill date',
      billValue: 'Bill value',
      actions: 'Actions'
    },
    paymentCard: {
      paymentType: 'Payment type',
      period: 'Period',
      paymentValue: 'Payment value',
      detail: 'Detail'
    },
    orderCard: {
      createOrder: 'Create order',
      workName: 'Work name',
      execStatus: 'Execution status',
      payStatus: 'Payment status',
      created: 'Created'
    }
  },
  buttons: {
    yes: 'Yes',
    no: 'No',
    submitBtn: 'Save',
    returnBtn: 'Return',
    closeBtn: 'Close',
    deleteBtn: 'Delete'
  },
  breadcrumbsItems: {
    edit: 'Edit',
    new: 'New'
  },
  cabinetBreadcrumbs: {
    home: 'Home',
    service: 'Service',
    payments: 'Payments',
    bills: 'Bills',
    orderNew: 'New order'
  },
  user: 'User'
});
registerLang('uk', {
  global: {
    loading: 'Завантаження...',
    error: 'Помилка',
    search: 'Пошук',
    filter: 'Фільтр',
    displayInactive: 'Відображати неактивні',
    welcomeNotification: 'Вітаємо в Дім Онлайн!',
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
      apartmentArea: 'Площа має бути відмінною від 0!',
      description: 'Поле опису не може бути пустим!'
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
    profile: 'профіль',
    service: 'сервісна служба',
    order: 'замовлення',
    work: 'роботи'
  },
  paymentList: {
    tableHeader: {
      apartment: 'Апартаменти',
      value: 'Вартість',
      actions: 'Дії'
    }
  },
  paymentForm: {
    header: 'Платіж для апартаментів:',
    apartment: 'Апартаменти',
    paymentType: 'Тип платежу',
    date: 'Дата',
    value: 'Вартість',
    purpose: 'Призначення:'
  },
  userList: {
    addBtn: 'Додати нового користувача',
    tableHeader: {
      firstName: 'Ім\'я',
      lastName: 'Прізвище',
      avatar: 'Аватар',
      birthDate: 'Дата народження',
      isActive: 'Активний',
      isPersonal: 'Персонал',
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
  orderList: {
    tableHeader: {
      apartment: 'Апартаменти',
      execStatus: 'Статус виконання',
      payStatus: 'Статус оплати',
      warning: 'Зауваження',
      workName: 'Робота',
      actions: 'Дії',
      editBtn: 'Редагувати'
    },
    addBtn: 'Додати замовлення'
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
    permissions: 'Права доступу',
    isStaff: 'Персонал',
    isStaffHelpText: 'Користувач матиме доступ до адмін сторінки',
    isActive: 'Активний',
    isActiveHelpText: 'Користувач матиме доступ до особистого кабінету',
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
    resident: 'Номер телефону жителя',
    residentCount: 'Кількість жителів',
    description: 'Описання',
    successUserAddMessage: 'При збереженні форми, користувача з номером :user буде додано до апартаментів.',
    newApartment: {
      title: 'Нові апартаменти'
    }
  },
  apartmentDelete: {
    text: 'Дійсно бажаєте видалити апартаменти'
  },
  phoneChecker: {
    number: 'Номер телефону жителя',
    placeholder: 'Введіть номер телефону жителя, щоб підв\'язати його до апартаментів',
    addUser: 'Додати користувача до апартаментів',
    userDoesNotExist: 'Користувач з номером :user відсутній в базі.',
    check: 'Перевірити'
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
  workList: {
    tableHeader: {
      title: 'Роботи',
      name: 'Назва',
      priceCode: 'Пункт кошторису',
      price: 'Ціна',
      duration: 'Тривалість',
      actions: 'Дії'
    },
    emptyDuration: 'Тривалість відсутня',
    addBtn: 'Додати роботу'
  },
  workForm: {
    name: 'Робота',
    priceCode: 'Пункт кошторису',
    price: 'Вартість',
    description: 'Описання',
    duration: 'Тривалість'
  },
  billList: {
    tableHeader: {
      apartment: 'Апартаменти',
      apartmentNumber: 'Номер',
      purpose: 'Призначення',
      actions: 'Дії'
    },
    addBtn: 'Додати рахунок',
    detail: 'Деталі'
  },
  billForm: {
    apartment: 'Апартаменти',
    apartmentNumber: 'Номер',
    totalValue: 'Загальна вартість',
    period: 'Період',
    purpose: 'Призначення'
  },
  orderForm: {
    newOrderHeader: 'Нове замовлення',
    house: 'Будинок',
    houseHelpText: 'Для вибору номеру апартаментів спочатку виберіть будинок',
    apartment: 'Апартаменти',
    work: 'Робота',
    execStatus: 'Статус виконання',
    payStatus: 'Статус оплати',
    information: 'Інформація',
    informationHelpText: 'Додатковий коментар',
    warning: 'Зауваження',
    executorsSet: {
      header: 'Виконавці',
      executor: 'Виконавець',
      scheduledTime: 'Запланований час',
      scheduledTimeHelpText: 'Плановий час закінчення роботи'
    },
    deleteModal: {
      title: 'Дійсно бажаєте видалити виконавця?'
    },
    selectValues: {
      apartment: 'Апартаменти №: :number',
      resident: 'Житель:'
    },
    description: 'Опис'
  },
  cabinet: {
    debt: 'Заборгованість',
    house: 'Будинок',
    company: 'Компанія',
    userCard: {
      administration: 'Адміністрування',
      profile: 'Мій профіль',
      cabinet: 'Персональний кабінет',
      logOut: 'Вийти'
    },
    sidebar: {
      notifications: 'Сповіщення',
      bills: 'Рахунки',
      payments: 'Оплати',
      services: 'Сервісна служба'
    },
    billCard: {
      pay: 'Оплатити',
      billNumber: 'Номер рахунку',
      billDate: 'Виписаний',
      billValue: 'Сума',
      actions: 'Дії'
    },
    paymentCard: {
      paymentType: 'Тип оплати',
      period: 'Період',
      paymentValue: 'Сума',
      detail: 'Опис'
    },
    orderCard: {
      createOrder: 'Створити замовлення',
      workName: 'Назва роботи',
      execStatus: 'Статус виконання',
      payStatus: 'Статус оплати',
      created: 'Дата створення'
    }
  },
  buttons: {
    yes: 'Так',
    no: 'Ні',
    submitBtn: 'Зберегти',
    returnBtn: 'Назад',
    closeBtn: 'Закрити',
    deleteBtn: 'Видалити'
  },
  breadcrumbsItems: {
    edit: 'Редагування',
    new: 'Новий'
  },
  cabinetBreadcrumbs: {
    home: 'Домівка',
    service: 'Сервісна служба',
    payments: 'Рахунки',
    bills: 'Оплати',
    orderNew: 'Нове замовлення'
  }
});