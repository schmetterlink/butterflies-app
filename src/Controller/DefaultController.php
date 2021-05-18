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
}