#!/bin/bash

git clone https://github.com/nvm-sh/nvm --branch v0.40.3
bash -c ./nvm/install.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install --lts
corepack enable pnpm

sudo apt install pip python3-venv
python3 -m pip install pipx
python3 -m pipx ensurepath

cd ./frontend
pnpm i
cd ../backend
python3 -m pipx install poetry
python3 -m pipx ensurepath
~/.local/bin/poetry install
