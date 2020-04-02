#!/bin/bash

## DESCRIPTION:
#    █████╗ ██████╗ ██████╗  █████╗ ██████╗ ████████╗
#   ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝
#   ███████║██████╔╝██████╔╝███████║██████╔╝   ██║
#   ██╔══██║██╔═══╝ ██╔═══╝ ██╔══██║██╔══██╗   ██║
#   ██║  ██║██║     ██║     ██║  ██║██║  ██║   ██║
#   ╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
#
## AUTHOR: Arrathilar

# get variables
NAME="dimonline"
APACHE_OWNER="apache:apache"
DEPLOY_BRANCH="master"
DEFAULT_ROOT_USER_WITH_ROOT="arrathilar"
PROJECT_OWNER_USERNAME="arrathilar"                             # default: dimonline
PROJECT_ROOT_DIRECTORY="/home/dimonline/appart/"                # default: /home/dimonline/dimonline/
PROJECT_DIRECTORY="/home/dimonline/appart/appart-frontend/"     # default: /home/dimonline/dimonline/appart-frontend/
BUILD_DIRECTORY="/home/dimonline/appart/appart-frontend/build/" # default: /home/dimonline/dimonline/appart-frontend/build/
APACHE_FRONTEND_FOLDER="/home/dimonline/frontend/"              # default: /home/dimonline/frontend/

WELCOME_TEXT="CiDilojilojilojilojilojilZcg4paI4paI4paI4paI4paI4paI4pWXIOKWiOKWiOKWiOKWiOKWiOKWiOKVlyAg4paI4paI4paI4paI4paI4pWXIOKWiOKWiOKWiOKWiOKWiOKWiOKVlyDilojilojilojilojilojilojilojilojilZcK4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4pWa4pWQ4pWQ4paI4paI4pWU4pWQ4pWQ4pWdCuKWiOKWiOKWiOKWiOKWiOKWiOKWiOKVkeKWiOKWiOKWiOKWiOKWiOKWiOKVlOKVneKWiOKWiOKWiOKWiOKWiOKWiOKVlOKVneKWiOKWiOKWiOKWiOKWiOKWiOKWiOKVkeKWiOKWiOKWiOKWiOKWiOKWiOKVlOKVnSAgIOKWiOKWiOKVkSAgIArilojilojilZTilZDilZDilojilojilZHilojilojilZTilZDilZDilZDilZ0g4paI4paI4pWU4pWQ4pWQ4pWQ4pWdIOKWiOKWiOKVlOKVkOKVkOKWiOKWiOKVkeKWiOKWiOKVlOKVkOKVkOKWiOKWiOKVlyAgIOKWiOKWiOKVkSAgIArilojilojilZEgIOKWiOKWiOKVkeKWiOKWiOKVkSAgICAg4paI4paI4pWRICAgICDilojilojilZEgIOKWiOKWiOKVkeKWiOKWiOKVkSAg4paI4paI4pWRICAg4paI4paI4pWRICAgCuKVmuKVkOKVnSAg4pWa4pWQ4pWd4pWa4pWQ4pWdICAgICDilZrilZDilZ0gICAgIOKVmuKVkOKVnSAg4pWa4pWQ4pWd4pWa4pWQ4pWdICDilZrilZDilZ0gICDilZrilZDilZ0gICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo="

#color red - errors, default and yellow
R=$(tput setaf 1)
N=$(tput sgr0)
Y=$(tput setaf 3)

echo ${WELCOME_TEXT} | base64 --decode
printf "\n"

# check existing DEFAULT_ROOT_USER_WITH_ROOT
if [ $(getent passwd $DEFAULT_ROOT_USER_WITH_ROOT) ]; then
  printf $Y"${DEFAULT_ROOT_USER_WITH_ROOT} exist\n"$N
else
  printf $R"${DEFAULT_ROOT_USER_WITH_ROOT} user does not exist\n"$N
  exit 0
fi

# check existing PROJECT_OWNER_USERNAME
if [ $(getent passwd $PROJECT_OWNER_USERNAME) ]; then
  printf $Y"${PROJECT_OWNER_USERNAME} exist\n"$N
else
  printf $R"${PROJECT_OWNER_USERNAME} owner does not exist\n"$N
  exit 0
fi

# check attributes
if [ -z "${APACHE_OWNER}" ]; then
  printf "%-$(expr 80 - ${#b})s %-40s\n" $R"apache:apache owner:group are required" "[error]"$N
  exit 1
fi

# move to project root dir
cd $PROJECT_ROOT_DIRECTORY || exit

# pull from git
sudo -u ${PROJECT_OWNER_USERNAME} git pull origin ${DEPLOY_BRANCH}

# move to project dir
cd $PROJECT_DIRECTORY || exit

# delete or create build dir
if [ -d "$BUILD_DIRECTORY" ]; then
  sudo rm -rfv $BUILD_DIRECTORY
  mkdir --verbose $BUILD_DIRECTORY
else
  mkdir --verbose $BUILD_DIRECTORY
fi

# run install
npm install || exit 0

# run build
npm run build || exit 0

# delete or create apache frontend dir
if [ -d "$APACHE_FRONTEND_FOLDER" ]; then
  sudo rm -rfv $APACHE_FRONTEND_FOLDER
  mkdir --verbose $APACHE_FRONTEND_FOLDER
else
  mkdir --verbose $APACHE_FRONTEND_FOLDER
fi

# move build directory
mv $BUILD_DIRECTORY* $APACHE_FRONTEND_FOLDER/
mv $BUILD_DIRECTORY.htaccess $APACHE_FRONTEND_FOLDER/
# change owner to apache
chown -R $APACHE_OWNER $APACHE_FRONTEND_FOLDER

# restart apache
sudo systemctl restart httpd.service || exit

# restart celery
sudo systemctl restart celeryd.service || exit

printf '%s%s%s%s' "$(tput setaf 3)" "$(tput blink)" "${NAME} was deployed" "$(tput sgr0)"
printf "\n"
