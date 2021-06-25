<?php

namespace App\Controller;

use App\Entity\Serializer\CustomNormalizer;
use App\Entity\User;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\PersistentCollection;
use JMS\Serializer\SerializationContext;
use JMS\Serializer\SerializerInterface;
use ReflectionClass;
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

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->user = $tokenStorage->getToken()->getUser();

        $this->classMetadataFactory = new ClassMetadataFactory(new AnnotationLoader(new AnnotationReader()));

        $defaultContext = [
            Serializer\Normalizer\AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                $reflect = new ReflectionClass($object);
                return $reflect->getShortName() . "." . $object->getId();
            },
        ];


        $this->normalizer = [
            new Serializer\Normalizer\ObjectNormalizer($this->classMetadataFactory, null, null, null, null, null, $defaultContext),
            new Serializer\Normalizer\DateTimeNormalizer(),
        ];
        /*
        [
            new Serializer\Normalizer\ObjectNormalizer($this->classMetadataFactory),
            new Serializer\Normalizer\DateTimeNormalizer([$this->classMetadataFactory]),
        ];
        */


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
        $userData = $this->serializer->serialize(
            $this->user,
            'json',
            ['groups' => 'list']
        );
        $response = new JsonResponse($userData);
        return $response;
    }

    /**
     * @Route("/api/search", name="api_search")
     */
    public function search(Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var $connect */
        $conn = $entityManager->getConnection();

        $searchterm = $request->get('searchterm') ?: $request->toArray();

        $sql = "
            SELECT u.id FROM user u
            WHERE match(`name`,`position`,`company`,`bio`,`tags`) AGAINST ('$searchterm');
            ";

        $stmt = $conn->prepare($sql);
        $results['user'] = $stmt->executeQuery()->fetchAllAssociative();

        $sql = "
            SELECT p.id FROM project p
            WHERE match(`title`,`description`,`tags`) AGAINST ('$searchterm');
            ";

        $stmt = $conn->prepare($sql);
        $results['project'] = $stmt->executeQuery()->fetchAllAssociative();

        //$entity = Entity\Project::class;

        $entityCollection = [];

        foreach ($results as $group => $results) {
            $entityClassName = 'App\Entity\\' . ucfirst($group);
            foreach ($results as $result) {
                $id = $result['id'];
                /** @var Entity $entity */
                $entityCollection[$group][$id] = $this->getDoctrine()->getRepository($entityClassName)->find($id);
            }
        }

        $serializedData = $this->serializer->serialize(
            $entityCollection,
            'json',
            ['groups' => 'list']
        );

        // returns an array of arrays (i.e. a raw data set)
        //$resultSet = ["results" => $results];

        $response = new JsonResponse($serializedData);
        return $response;
    }
}
