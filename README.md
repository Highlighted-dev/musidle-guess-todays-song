# MusidleGuessTodaysSong

This is a music guessing game where players have to guess the song of the day.

## State of the project

The project is currently _abandoned_. I really liked the project, but as I use copyrighted material I may get sued if this gets popular, even when I am not making any money from it. Some things are definetly not ready for production, keep that in mind. Some things may also be a little messy, as the project isn't finished, keep that in mind.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository: `git clone https://github.com/Highlighted-dev/musidle-guess-todays-song`
2. Navigate into the project directory: `cd musidle-guess-todays-song`
3. Install the dependencies: `npm install`
4. Add the an .env file in `/apps/musidle-frontend` with these variables (if they are empty you should fill them up):

```
NEXT_PUBLIC_API_HOST =
NEXTAUTH_URL= "http://localhost:4200"
NEXTAUTH_URL_PROD=
NEXTAUTH_SECRET =
MONGODB_URL =
MONGODB_URL_PROD =
JWT_SECRET =
NEXT_PUBLIC_VERSION=0.11.0
```

and an .env file in `/apps/musidle-api` with these variables (if they are empty you should fill them up):

```
LASTFM_API_KEY =
MONGODB_URL =
MONGODB_URL_PROD =
JWT_SECRET =
PORT = "5000"
API_URL =
MAILGUN_API_KEY =
SERVER_KEY =
SERVER_CERT =
SERVER_CA =
INTERMIDIATE_CA=
```

5. Create an 'assets' folder in `/apps/musidle-api/src/` and put any songs that you would want there. The songs that were used in project were named like that: `pop1.mp3`, `rock8.mp3` etc. for phase one, `artist1.mp3` etc. for phase 2, `final1.mp3` etc. for phase 3.

6. Make a dev and prod databases (I named them `musidle` for development and `musidle-prod` for production) in mongoDB.

7. Start the development server: `nx serve musidle-frontend` and `nx serve musidle-api`

Now, open your browser and navigate to http://localhost:4200/. Happy coding!

## Running the tests

To run tests use `nx run musidle-api:test`

## Built With

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [ShadcnUI](https://ui.shadcn.com/)

## Authors

- Highlighted-dev - Initial work - [Highlighted-dev](https://github.com/Highlighted-dev)

See also the list of [contributors](https://github.com/yourusername/MusidleGuessTodaysSong/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
