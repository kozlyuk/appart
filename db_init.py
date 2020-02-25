""" Create initial database """
from accounts.models import User
from condominium.models import Company, House, Apartment

# Cteare superuser
User.objects.create_superuser('0673607460', 'sergey.kozlyuk@gmail.com', '100Grad')
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
    resident_obj = User.objects.create(first_name=resident[0],
                                       last_name=resident[1],
                                       mobile_number=resident[2],
                                       email=resident[3],
                                       )
    residents_list.append(resident_obj)

index = 0
for apartment in apartments:
    apartment.resident = residents_list[index]
    apartment.save()
    index += 1

print("Initial residents created")