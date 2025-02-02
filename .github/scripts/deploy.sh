#!/bin/bash

COMMIT_SHA="$1"
HOST="$2"
STACK="$3"

set +x
echo "${{ secrets.DEPLOY_SSH_PRIVATE_KEY }}" | tr -d '\r' >~/.ssh/id_ed25519
set -x
chmod 600 ~/.ssh/id_ed25519
ssh-keyscan -H "${{ vars.HOST }" >>~/.ssh/known_hosts
tee -a ~/.ssh/config << END
Host manager
    HostName ${{ vars.HOST }
    User deploy
    StrictHostKeyChecking no
END
rsync -ra "docker-compose.yml" "manager:~/docker-compose.yml"
ssh manager bash <<EOF
    COMMIT_SHA=${{ github.sha }} \
    HOST=${{ vars.HOST }} \
    STACK=${{ vars.STACK }} \
    docker stack deploy -c docker-compose.yml --prune --with-registry-auth ${{ vars.STACK }}
EOF