cd /home/ubuntu/deploy/SweetClub

docker-compose down

docker rm -f $(docker ps -aq)
docker rmi $(docker images -q)

docker pull timssuh/sweetclub_back
docker pull timssuh/sweetclub-front
docker pull timssuh/sweetclub-nginx

docker-compose up -d