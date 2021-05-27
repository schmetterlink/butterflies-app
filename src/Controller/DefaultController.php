<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null})
     */
    public function index()
    {
        return $this->render('default/index.html.twig');
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