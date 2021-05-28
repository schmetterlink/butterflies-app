<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ApiController extends AbstractController
{
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
}
