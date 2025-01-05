<?php

namespace App\Controller\Api;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class LoginCustomController
{
    private $jwtEncoder;

    public function __construct(JWTEncoderInterface $jwtEncoder)
    {
        $this->jwtEncoder = $jwtEncoder;
    }

    public function login(Request $request, UserInterface $user): JsonResponse
    {
        // Générer le token JWT
        $token = $this->jwtEncoder->encode([
            'username' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
            'exp' => time() + 3600, // Exemple : 1 heure de validité
        ]);

        // Retourner la réponse avec des informations supplémentaires
        return new JsonResponse([
            'token' => $token,
            'api' => '/api', // Existant
            'user_id' => $user->getId(), // Ajouté
        ]);
    }
}
