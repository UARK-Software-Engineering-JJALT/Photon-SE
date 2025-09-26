# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
corepack enable pnpm
python3 -m pip install --user pipx

pnpm i
pipx install poetry
cd ./backend
poetry install
cd ..
pnpm run dev