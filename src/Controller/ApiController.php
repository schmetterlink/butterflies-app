<?php

namespace App\Controller;

use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer as Serializer;

class ApiController extends AbstractController
{

    private $serializer;

    public function __construct(Serializer\SerializerInterface $serializer) {
        $this->serializer = $serializer;
    }

    #[Route('/api/null', name: 'api')]
    public function index(): Response
    {
        return $this->render('api/index.html.twig', [
            'controller_name' => 'ApiController',
        ]);
    }
    /**
     * @Route("/api/test", name="testapi")
     */
    public function test(Request $request, TokenStorageInterface $tokenStorage)
    {
        return $this->json([
            'user' => $tokenStorage->getToken(),
            'message' => 'token storage works!',
        ]);
    }
    /**
     * @Route("/api/me", name="testapi")
     */
    public function me(Request $request, TokenStorageInterface $tokenStorage): JsonResponse
    {
        $encoder = new Serializer\Encoder\JsonEncoder();
        $defaultContext = [
            Serializer\Normalizer\AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object::class;
            },
        ];

        $user = $tokenStorage->getToken()->getUser();

        $userData = $this->serializer->serialize($user, 'json', $defaultContext);

        $response = new JsonResponse($userData);
        return $response;
    }
}
