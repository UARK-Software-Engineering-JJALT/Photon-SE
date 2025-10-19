#!/bin/bash -i

git clone https://github.com/nvm-sh/nvm --branch v0.40.3
bash -c ./nvm/install.sh

source ~/.bashrc

nvm install --lts
corepack enable pnpm

sudo apt-get -y install pip python3-venv
python3 -m pip install pipx
python3 -m pipx ensurepath

cd ./frontend
yes | pnpm i
cd ../backend

python3 -m pipx install poetry
python3 -m pipx ensurepath
source ~/.bashrc
poetry install
