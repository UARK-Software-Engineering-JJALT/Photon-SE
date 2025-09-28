# Photon

Photon is a full-stack web application consisting of:

- **Frontend**: Next.js
- **Backend**: Python w/ Websocket
- **Database**: PostgreSQL

---

## Start on Debian VM

1. GOTO Development and follow the install_deps.sh instructions first.
2. Open 2 terminals, one navigated to the backend folder and the other to the frontend folder.
3. In the backend terminal, run the following command.
```bash
poetry run python src/main.py
```
4. In the frontend terminal, run the following command.
```bash
pnpm run dev
```
5. Open a browser window to https://localhost:3000

### Shutdown

To shutdown the application, in each terminal window, use **ctrl+c** to stop each application.

## Development

Development dependencies:

To install the dependencies on the Debian VM, run the install_deps.sh shell script which will install node 22 and poetry

```bash
chmod +x install_deps.sh
./install_deps.sh
```

Else follow each individual dependency to develop on your own system.

- [Python 3](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/#installing-with-pipx)
- [Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once you've installed the development dependencies, you can follow instructions to start each component.

### Start Backend

```bash
cd backend
poetry install
poetry run python src/main.py 

||

poetry run python src/main.py x.x.x.x # Enter IP address to change UDP network 
```

### Start Frontend

```bash
cd frontend
npm install # or yarn / pnpm
npm run dev
```

## Project Structure

```bash
.
├── backend/        # Python backend 
├── frontend/       # Next.js frontend
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
