# Photon

Photon is a full-stack web application consisting of:

- **Frontend**: Next.js
- **Backend**: Flask (Python)
- **Database**: PostgreSQL

---

## Prerequisites

Before running Photon, make sure you have [docker](https://docs.docker.com/engine/install/) installed.

Verify installation:

```bash
docker --version
docker compose version
```

## Production

Deployment for Production:

```bash
docker compose build
docker compose up
```

- Frontend will be available at http://localhost:3000
- Backend API will be at http://localhost:5000
- PostgreSQL will listen on port 5432

To stop the stack:
```bash
docker compose down
```

## Development

At the moment, docker-compose.yaml only really works to start a production build the the program. In order to develop and each component separetely, you will need to start each component separetely which would require a few things to be installed on your system

Development dependencies:


- [Python 3](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/#installing-with-pipx)
- [Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once you've installed the development dependencies, you can follow instructions to start each component.

### Start Database

```bash
docker compose up database
```

### Start Backend

```bash
cd backend
poetry install
poetry run python src/main.py
```

### Start Frontend

```bash
cd frontend
npm install # or yarn / pnpm
npm run dev
```

TODO for the future:

-Create a docker-compose.dev.yaml fil that would enable hot-reloading for Flask and Next.js

## Project Structure

```bash
.
├── backend/        # Flask backend (Python, Poetry)
├── frontend/       # Next.js frontend
├── database/       # Database init scripts
├── docker-compose.yaml
└── README.md
```

## Notes

The default credentials for the database are:
- User: postgres
- Password: postgres
- Database: postgres

and port is 5432


## Names
  jaxbkr: Jackson Baker
  analog-wizard: Alexander Spicer
  Leo Teeuwen: Leo Teeuwen
  natanojjj: Jonatan Chavez-Vasquez
  TristanJ04: Tristan Jones
