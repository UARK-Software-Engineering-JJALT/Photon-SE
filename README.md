# Photon

Photon is a full-stack web application consisting of:

- **Frontend**: Next.js
- **Backend**: Python w/ Websocket
- **Database**: PostgreSQL

---

## Development

Development dependencies:

- [Python 3](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/#installing-with-pipx)
- [Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once you've installed the development dependencies, you can follow instructions to start each component.

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

-Create a start.sh script to start up both the frontend and backend in the same time concurrently in one terminal. Also add dependency checking.

## Project Structure

```bash
.
├── backend/        # Python backend 
├── frontend/       # Next.js frontend
├── database/       # Database init scripts
└── README.md
```

## Notes

### Ports:

UDP Recieve: 7500
UDP Transmit: 7501 
Websocket: 8765

- Frontend will be available at http://localhost:3000

## Names
  jaxbkr: Jackson Baker
  analog-wizard: Alexander Spicer
  Leo Teeuwen: Leo Teeuwen
  natanojjj: Jonatan Chavez-Vasquez
  TristanJ04: Tristan Jones
