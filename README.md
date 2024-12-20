pour initier le projet faire les commande suivante:

docker-compose up -d --build

une fois le contenaire lancer rentrer dans le contenaire sylius avec 

docker exec -it sylius bash

ensuite crée un fichier .env.local avec cette ligne ou les info de votre base de donnée
DATABASE_URL=mysql://user:pwd@mysql:3306/sylius

faires la commande suivante pour instaler sylius

bin/console sylius:install

export l'api au format json et metre le fichier dans le conteneur nuxt a la racine

bin/console api:openapi:export > export_api.json

le detail de l'api est disponible a l'adresse suivante:
http://sylius.localhost/api/v2/docs
