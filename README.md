# [Minecraft Dashboard Angular] [![version][version-badge]][CHANGELOG]

![MinecraftDashboard Alpha](https://serving.photos.photobox.com/188009068488d9fce05e5459d2269ad94853ada410acef1d9957ea0f3b73fbb24936aa22.jpg)

Hello GitHub community.

I present the first project I am trying to do to manage MineCraft servers using NodeJS and Angular to perform various system operations.

I hope you like it and if you want to help in its realization do not hesitate to do so.

# Table of Contents:
1. [English](#English)
    1. [Install](#Install)
    2. [Run](#Run)
2. [Español](#Español)
    1. [Instalación](#Instalación)
    2. [Iniciar](#Iniciar)

# English

## Install
First and foremost it is necessary to have a folder with some MineCraft server (e.g. Spigot), also it is necessary to create a ".env" file with certain data to start using the platform (inside the files there is an example with data to complete).


Along with it to install the dependencies that the project uses is only necessary to use.

```
npm install
```


The project currently uses MongoDB as a database, in part this is to see how this database behaves for platforms of this type (possibly later think about changing the database).
## Run
To start using the platform you first need to have started the database (Mongo DB).

Apart from that, we must start the application Angular, there are two possibilities, you can compile the project with.
```
ng build --prod or ng build
```
Or you can run the server with
```
ng serve
```
And start using the front-end

Also, we must run the back-end (the main file is server.js), this can be done with PM2 or only with.
```
node server.js
```
inside of the folder of the project.

If you use an IDE you already know how to run the project ;)
# Español

## Instalación
Primero y principal es necesario tener una carpeta con algún servidor de MineCraft (e.g. Spigot), además es necesario crear un archivo “.env” con ciertos datos para empezar a utilizar la plataforma (dentro de los archivos hay un ejemplo con datos para completar).

Junto con ello para instalar las dependencias que el proyecto utiliza, solo es necesario usar.
```
npm install
```


El proyecto actualmente utiliza MongoDB como base de datos, en parte esto es para ver como se comporta esta base de datos para plataformas de este tipo (posiblemente más adelante piense en cambiar la base de datos).
## Iniciar
Para comenzar a utilizar la plataforma primero es necesario tener iniciada la base de datos (Mongo DB).

Por otro lado, debemos iniciar la aplicación Angular, hay dos posibilidades, puedes compilar el proyecto con
```
ng build --prod or ng build
```
O puedes correr el servidor con
```
ng serve
```
Además, debemos correr el back-end (el archivo principal es server.js), esto lo pueden hacer con PM2 o solo con.
```
node server.js
```
Si utilizas una IDE ya sabes como correr el proyecto ;)


[CHANGELOG]: ./CHANGELOG.md
[version-badge]: https://img.shields.io/badge/version-0.0.1-blue.svg
