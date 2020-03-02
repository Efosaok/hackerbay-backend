# Hackerbay-backend Challenge
[![codecov](https://codecov.io/gh/Efosaok/hackerbay-backend/branch/master/graph/badge.svg)](https://codecov.io/gh/Efosaok/hackerbay-backend)

This is my solution to the hackerbay backend challenge. 


### Installation and Setup

To run this application locally, make sure to have [Node.js](https://nodejs.org/) installed. having done that

```
$ npm i
```

```
$ npm start
```

##### Setup via Docker

To get up and running with the Public docker image.

```
$ docker pull efosa/hackerbay-backend:1.0
```

```
$ docker container run --publish <PORT_TO_MAP>:8080 --detach --name <NAME> efosa/hackerbay-backend:1.0
```

### Running tests

```
$ npm test
```

### Swager documentation
The swagger documentation is hosted on the microservice on the `/api-docs` endpoint.
