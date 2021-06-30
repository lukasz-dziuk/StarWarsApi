To start mongoDb docker container follow these steps:

1. Make sure you have docker installed. If not, go to the website https://www.docker.com/get-started and download docker desktop for your system.
2. Check if you have an access to docker cli, just type 'docker -v' and you should see the version of the docker installed.
3. Pull the latest mongoDb version by typing in your terminal 'docker pull mongo:latest'
4. In the terminal, go to the directory of this file (you should also see here docker-compose.yml) and type 'docker-compose up -d'
5. After few seconds mongoDb container should be up and running. You can see this in you docker desktop or by typing 'docker ps' in your terminal.

Now you can test star wars API. When you finish type 'docker-compose down' to get rid of the mongo container