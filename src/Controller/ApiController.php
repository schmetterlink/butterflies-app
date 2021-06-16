<?php

namespace App\Controller;

use App\Entity\Serializer\CustomNormalizer;
use App\Entity\User;
use Doctrine\Common\Annotations\AnnotationReader;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer as Serializer;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AnnotationLoader;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\VarDumper\VarDumper;

class ApiController extends AbstractController
{

    /** @var Serializer\Serializer serializer */
    private $serializer;
    /** @var ClassMetadataFactory $classMetadataFactory */
    private $classMetadataFactory;
    /** @var Serializer\Normalizer\ObjectNormalizer $normalizer */
    private $normalizer;
    /** @var User $user */
    private $user;

    public function __construct(TokenStorageInterface $tokenStorage) {
        $this->user = $tokenStorage->getToken()->getUser();

        $this->classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));
        $this->normalizer = [
            new Serializer\Normalizer\ObjectNormalizer($this->classMetadataFactory),
            new Serializer\Normalizer\DateTimeNormalizer([$this->classMetadataFactory])
        ];

        $this->serializer = new Serializer\Serializer($this->normalizer, [new Serializer\Encoder\JsonEncoder()]);
    }

    #[Route('/api/null', name: 'api')]
    public function index(): Response
    {
        return $this->render('api/index.html.twig', [
            'controller_name' => 'ApiController',
        ]);
    }
    /**
     * @Route("/api/test", name="api_test")
     */
    public function test(Request $request, TokenStorageInterface $tokenStorage)
    {
        return $this->json([
            'user' => $tokenStorage->getToken(),
            'message' => 'token storage works!',
        ]);
    }
    /**
     * @Route("/api/me", name="api_me")
     */
    public function me(Request $request, TokenStorageInterface $tokenStorage): JsonResponse
    {
        //$user = $this->serializer->normalize($this->user, null, ['groups' => 'list']);

        //$user = $this->serializer->normalize($user, null, $defaultContext);
        $userData = $this->serializer->serialize($this->user, 'json', ['groups' => 'list']);
        $response = new JsonResponse($userData);
        return $response;
    }
}
