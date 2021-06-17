<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use phpDocumentor\Reflection\Types\Boolean;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\VarDumper\VarDumper;

use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Class JwtAuthenticator
 * @package App\Security
 */
class JwtAuthenticator extends AbstractGuardAuthenticator
{
    private $em;
    private $params;

    /**
     * JwtAuthenticator constructor.
     * @param EntityManagerInterface $em
     * @param ContainerBagInterface $params
     */
    public function __construct(EntityManagerInterface $em, ContainerBagInterface $params)
    {
        /*
            inspired by
            https://smoqadam.me/posts/how-to-authenticate-user-in-symfony-5-by-jwt/
            https://symfonycasts.com/screencast/symfony-rest4/jwt-guard-authenticator
        */
        $this->em = $em;
        $this->params = $params;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return RedirectResponse
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new RedirectResponse('/login');
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request): bool
    {
        return  $request->get('token', false) !== false || $request->headers->has('Authorization');
    }

    /**
     * @param Request $request
     * @return string
     */
    public function getCredentials(Request $request): string
    {
        $credentials = $request->headers->get('Authorization') ?: $request->get('token', false);
        $credentials = str_replace('Bearer ', '', $credentials);
        return $credentials;
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return User
     * @throws AuthenticationException
     */
    public function getUser($credentials, UserProviderInterface $userProvider): User
    {
        try {
            $jwt = (array) JWT::decode(
                $credentials,
                $this->params->get('jwt_secret'),
                ['HS256']
            );
            /** @var User $user */
            $user = $this->em->getRepository(User::class)
                ->findOneBy([
                    'email' => $jwt['user'],
                ]);
            return $user;
        }catch (\Exception $exception) {
            throw new AuthenticationException($exception->getMessage());
        }
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse|RedirectResponse
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse|RedirectResponse
    {
        if (strpos($request->headers->get('accept'),"application/json") !== false) {
            return new JsonResponse([
                'message' => $exception->getMessage()
            ], Response::HTTP_UNAUTHORIZED);
        }
        return new RedirectResponse("/redirect?to=/login&message=your session has expired.");
    }

    /**
     * @param TokenInterface $token
     * @param UserProviderInterface $userProvider
     * @param $providerKey
     */
    public function authenticateToken(TokenInterface $token, UserProviderInterface $userProvider, $providerKey) {
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return Response|void|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {

    }

    /**
     * @return bool
     */
    public function supportsRememberMe()
    {
        return true;
    }
}