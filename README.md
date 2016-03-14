# SheduleApp
Приложение предназначено для студентов вузов. Оно предоставляет возможность создавать, редактировать, изменять расписания. Расписания создаются с помощью выбора преподавателя, времени, аудитории, названия предмета из списка. Пользователь также может добавить свои данные ( преподаватель, время, аудитория, название предмета), если не найдет их в списке. Расписания хранятся на сервере. Взаимодействие клиентов с сервером осуществляется с помощью REST запросов.

```bash
# Clone and Install dependencies
$ npm install -g ionic
$ git clone https://github.com/fedor96gaponenko/SheduleApp.git
$ cd server
$ npm install
$ node server.js
