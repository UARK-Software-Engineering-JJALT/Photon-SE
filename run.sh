curl -o- https://fnm.vercel.app/install | bash
fnm install 22
corepack enable pnpm
python3 -m pip install --user pipx

pnpm i
pipx install poetry
cd ./backend
poetry install
cd ..
pnpm run dev