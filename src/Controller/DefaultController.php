<?php

namespace App\Controller;

use App\Security\JwtAuthenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;
use Symfony\Component\Security\Guard\Token\GuardTokenInterface;
use Symfony\Component\VarDumper\VarDumper;

class DefaultController extends AbstractController
{
    /**
     * @Route("/dashboard", name="dashboard", defaults={"reactRouting": null})
     */
    public function dashboard(Request $request, TokenStorageInterface $tokenStorage, JwtAuthenticator $authenticator)
    {
        try {
            $this->denyAccessUnlessGranted('ROLE_USER');
        } catch (AuthenticationCredentialsNotFoundException $e) {
            return $this->redirect('/login');
        }
        $user = $tokenStorage->getToken();
        return $this->render('default/dashboard.html.twig', [
            'user' => $user->getUser(),
            'token' => $authenticator->getCredentials($request)
        ]);
    }
    /**
     * @Route("/logout", name="logout", defaults={"reactRouting": null})
     */
    public function logout(Request $request, TokenStorageInterface $tokenStorage, Session $session)
    {
        $tokenStorage->setToken();
        $session->clear();
        return $this->redirect('/login');
    }
    /**
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null})
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', ["headers"=>$request->headers] );
    }
    /**
     * @Route("/api/users", name="users")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getUsers()
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Timor Kodal',
                'description' => 'Lorem Ipsum',
                'imageURL' => 'build/images/tea-guevara.jpg'
            ],
            [
                'id' => 2,
                'name' => 'Hiu-Fai Lau',
                'description' => '',
                'imageURL' => '/images/hiu-fai.jpg'
            ],
            [
                'id' => 3,
                'name' => 'Johanna Reichenbach',
                'description' => '',
                'imageURL' => '/images/johanna.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Linus Wetzel',
                'description' => '',
                'imageURL' => '/images/linus.jpg'
            ],
            [
                'id' => 5,
                'name' => 'Gregory Tumoscheid',
                'description' => '',
                'imageURL' => '/images/greg.jpg'
            ]
        ];
        /** @var JsonResponse $response */
        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($users));

        return $response;
    }
    /**
     * @Route("/api/posts", name="posts")
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getPosts()
    {
        $posts = [
              [
                  "userId" => 1,
                "id" => 1,
                "title" => "wurst aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body" => "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
              ],
              [
                  "userId" => 1,
                "id" => 2,
                "title" => "qui est essen",
                "body" => "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
              ],
              [
                  "userId" => 1,
                "id" => 3,
                "title" => "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                "body" => "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
              ],
              [
                  "userId" => 1,
                "id" => 4,
                "title" => "eum et est occaecati",
                "body" => "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
              ],
              [
                  "userId" => 1,
                "id" => 5,
                "title" => "nesciunt quas odio",
                "body" => "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
              ]
        ];
        /** @var JsonResponse $response */
        $response = new Response();

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        $response->setContent(json_encode($posts));

        return $response;
    }


}