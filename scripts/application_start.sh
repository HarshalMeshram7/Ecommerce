sudo rm -rf /var/www/ci-cd-react/build
sudo npm run build
forever stopall
forever start -c "node -r esm" Server.js
