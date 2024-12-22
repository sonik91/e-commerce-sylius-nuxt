### pour initier le projet faire les commande suivante:

    docker-compose up -d --build

    Dans sylius vous avais besoin de modifier/crée les canaux pour avoir un shop sur l'url sylius.localhost ou la valeur renseigner dans SYLIUS_HOST 

### Si besoin de cree une bd pour sylius faire les commande suivante
    docker exec -it --user www-data sylius bash
    php bin/console doctrine:schema:update --force

### si besoin de crée un jeux de donné test
    docker exec -it --user www-data sylius bash
    php bin/console sylius:fixtures:load

### si besoin de crée un utilisateur admin
    docker exec -it --user www-data sylius bash
    php bin/console sylius:admin-user:create

### génération jwt token dans sylius afin de faire fonctionner l'api
    docker exec -it --user www-data sylius bash
    php bin/console sylius:install:jwt-setup