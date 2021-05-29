<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Firebase\JWT\JWT;

class AuthController extends AbstractController
{
    #[Route('/auth', name: 'auth')]
    public function index(): Response
    {
        return $this->render('auth/index.html.twig', [
            'controller_name' => 'AuthController',
        ]);
    }

    /**
     * @Route("/auth/register", name="register", methods={"POST"})
     */
    public function register(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $password = $request->get('password');
        $email = $request->get('email');
        $name = $request->get('name');
        $user = new User();
        $user->setPassword($encoder->encodePassword($user, $password));
        $user->setEmail($email);
        $user->setName($name);
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();
        return $this->json([
            'user' => $user->getEmail()
        ]);
    }

    /**
     * @Route("/auth/login", name="login", methods={"POST"})
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
            'email'=>$email,
        ]);
        if (!$user || !$encoder->isPasswordValid($user, $password)) {
            return $this->json([
                'email' => $email,
                'password' => $password,
                'message' => 'email ('.$email.') or password ('.$password.') is wrong.',
            ]);
        }
        $payload = [
            "user" => $user->getUsername(),
            "name" => $user->getName(),
            "exp"  => (new \DateTime())->modify("+5 minutes")->getTimestamp(),
        ];


        $jwt = JWT::encode($payload, $this->getParameter('jwt_secret'), 'HS256');
        return $this->json([
            'payload' => $payload,
            'token' => sprintf('Bearer %s', $jwt),
        ]);
    }
}
