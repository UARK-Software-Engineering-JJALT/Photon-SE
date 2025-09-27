#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
corepack enable pnpm
apt install pip python3-venv
python3 -m pip install pipx
python3 -m pipx ensurepath
cd ./frontend
pnpm i
cd ..
pipx install poetry
cd ./backend
poetry install
cd ..
pnpm run dev