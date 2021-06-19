<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Firebase\JWT\JWT;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\VarDumper\VarDumper;

class AuthController extends AbstractController
{
    /**
     * @Route("/auth", name="auth", methods={"POST"})
     */
    public function index(): Response
    {
        return $this->render('auth/index.html.twig', [
            'controller_name' => 'AuthController',
        ]);
    }

    /**
     * @Route("/auth/register", name="auth_register", methods={"POST"})
     */
    public function register(Request $request, UserPasswordEncoderInterface $encoder, ValidatorInterface $validator): JsonResponse
    {
        $password = $request->get('password');
        $email = $request->get('email');
        $name = $request->get('name');
        if (!$email) {
            $parameters = json_decode($request->getContent(), true);
            $name = $parameters['name'] ?: '';
            $email = $parameters['email'] ?: '';
            $password = $parameters['password'] ?: '';
        }
        $user = new User();

        $user->setPassword($encoder->encodePassword($user, $password));
        $user->setEmail($email);
        $user->setName($name);

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            //$errorsString = (string) $errors;
            $errorList = [];
            /** @var ConstraintViolation $error */
            foreach ($errors as $error) {
                $errorList[$error->getPropertyPath()][] = $error->getMessageTemplate();
            }
            return new JsonResponse($errorList, 400);
        }


        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();
        return new JsonResponse([
            'user' => $user->getEmail()
        ], 200);
    }
    /**
     * @Route("/auth/logout", name="auth_logout", methods={"POST", "GET"})
     */
    public function logout(TokenStorageInterface $tokenStorage, Session $session)
    {
        $session->clear();
        $tokenStorage->setToken();
        return $this->json([
            'payload' => $tokenStorage->getToken()
        ]);
    }
    /**
     * @Route("/auth/login", name="auth_login", methods={"POST"})
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $encoder)
    {
        $email = $request->get('email');
        $password = $request->get('password');
        if (!$email) {
            $parameters = json_decode($request->getContent(), true);
            $email = $parameters['email'] ?: '';
            $password = $parameters['password'] ?: '';
        }
        $user = $userRepository->findOneBy([
            'email' => $email,
        ]);
        if (!$user || !$encoder->isPasswordValid($user, $password)) {
            return $this->json([
                'email' => $email,
                'password' => $password,
                'message' => 'email (' . $email . ') or password (' . $password . ') is wrong.',
            ]);
        }
        $payload = [
            "uid" => $user->getId(),
            "user" => $user->getUsername(),
            "name" => $user->getName(),
            "exp" => (new \DateTime())->modify("+5 minutes")->getTimestamp(),
        ];


        $jwt = JWT::encode($payload, $this->getParameter('jwt_secret'), 'HS256');
        return $this->json([
            'payload' => $payload,
            'token' => sprintf('Bearer %s', $jwt),
        ]);
    }


}
