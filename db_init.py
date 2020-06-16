""" Create initial database """
from datetime import date, timedelta
from django.contrib.auth.models import Group
from accounts.models import User
from condominium.models import Company, House, Apartment
from payments.models import Service, Rate
from payments.tasks import create_area_bills
from dimservice.models import Work, Order


# Cteare superuser
user = User.objects.create_superuser('0673607460', 'sergey.kozlyuk@gmail.com', '100Grad')
print("Superuser with login 0673607460 created")


# Create initial Company
COMPANY = Company.objects.create(name='ТОВ "Cтоград"',
                                 fullname='Товариство з обмеженою відповідальністю "Стоград"',
                                 address="м. Рівне, вул. Клима Савури 14А",
                                 logo='company/logo/logo.svg',
                                 phone='096 550 59 31',
                                 email='stograd.office@gmail.com',
                                 description='Стоград — надійний забудовник, який відзначається високою якістю будівництва!',
                                 service_numbers='+38 (068) 093-22-94, +38 (068) 288-19-33'
                                 )
print("Initial Company created")

HOUSES = [['ЖК Hill House', 'вул. Перший промінь, 7Б', 40],
          ['ЖК Корольова', 'вул. Корольова, 23', 100],
          ['ЖК Bridge Town', 'вул. С. Бандери, 1Д', 150],
          ['ЖК BRIDGE Tower', 'вул. Драгоманова, 27', 200],
          ['ЖК Prestige Apartments', 'вул. Толстого, 10', 150],
          ['ЖК Сімейний', 'вул. Квашенка, 2 (район ТРЦ "Екватор)', 100]
          ]

for house in HOUSES:
    House.objects.create(name=house[0],
                         address=house[1],
                         apartments_count=house[2])
print("Initial Houses created")

house = House.objects.first()
apartments = Apartment.objects.filter(house=house)[:10]

RESIDENTS = [['Resident', '1', '0000000001', 'resident1@gmail.com'],
             ['Resident', '2', '0000000002', 'resident2@gmail.com'],
             ['Resident', '3', '0000000003', 'resident3@gmail.com'],
             ['Resident', '4', '0000000004', 'resident4@gmail.com'],
             ['Resident', '5', '0000000005', 'resident5@gmail.com'],
             ['Resident', '6', '0000000006', 'resident6@gmail.com'],
             ['Resident', '7', '0000000007', 'resident7@gmail.com'],
             ['Resident', '8', '0000000008', 'resident8@gmail.com'],
             ['Resident', '9', '0000000009', 'resident9@gmail.com'],
             ['Resident', '10', '0000000010', 'resident10@gmail.com'],
             ]

residents_list = []
for resident in RESIDENTS:
    resident_obj = User.objects.create_user(mobile_number=resident[2],
                                            email=resident[3],
                                            password='Test12',
                                            first_name=resident[0],
                                            last_name=resident[1],
                                            is_active=True
                                            )
    residents_list.append(resident_obj)
residents_list.append(user)

index = 0
for apartment in apartments:
    apartment.resident = residents_list[index]
    apartment.is_active = True
    apartment.area = 50
    apartment.account_number = residents_list[index].pk
    apartment.save()
    index += 1

print("Initial residents created")


SERVICES = [['Управління будинком', 'Внески на управління багатоквартирним будинком',
             'BA', 3.55, 'sq.m.'],
            ['Утримання будинку', 'Внески на утримання багатоквартирного будинку',
             'BA', 0.95, 'sq.m.'],
            ['Теплова енергія', 'Внески на теплову енергію',
             'BC', 1497.0, 'Gcal']
]

for service in SERVICES:
    service = Service.objects.create(name=service[0],
                                     description=service[1],
                                     uom_type=service[2],
                                     uom=service[4])
    Rate.objects.create(house=house,
                        service=service,
                        rate=service[3],
                        from_date=date.today())
print("Initial Services created")

create_area_bills(date.today())

print("Initial Bills created")

WORKS = [['Послуги сантехніка', '1.1', 300, 1, True],
         ['Послуги сантехніка 2 кат.', '1.2', 500, 2, False],
         ['Послуги сантехніка 3 кат.', '1.3', 700, 3, False],
         ['Послуги електрика', '2.1', 200, 1, True],
         ['Послуги електрика 2 кат.', '2.2', 400, 2, False],
         ['Послуги електрика 3 кат.', '2.3', 600, 3, False],
         ['Ремонт кондиціонера', '3.1', 500, 1, True],
         ['Ремонт кондиціонера 2 кат.', '3.2', 750, 2, False],
         ['Ремонт кондиціонера 3 кат.', '3.3', 1000, 3, False],
         ]

for work in WORKS:
    work_obj = Work.objects.create(name=work[0],
                                   price_code=work[1],
                                   price=work[2],
                                   duration=timedelta(hours=work[3]),
                                   is_basic=work[4])

    for apartment in apartments:
        Order.objects.create(apartment=apartment,
                             work=work_obj,
                             created_by=user)

print("Initial Works and Orders created")


# Create user groups
Group.objects.create(name='Менеджери')
Group.objects.create(name='Диспетчери')
Group.objects.create(name='Резиденти')
Group.objects.create(name='Майстри')

print("User groups created")
