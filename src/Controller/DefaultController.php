<?php

namespace App\Controller;

use App\Form\FileUploadType;
use App\Security\JwtAuthenticator;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;
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
        $data = [
            'user' => $user->getUser(),
            'token' => $authenticator->getCredentials($request)
        ];
        return $this->render('default/dashboard.html.twig', $data);
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
     * @Route("/redirect", name="redirect", defaults={"reactRouting": null})
     */
    public function redirectTo(Request $request)
    {
        return $this->render(
            'default/redirect.html.twig',
            [
                "targetUri" => $request->get('to', '/login'),
                "message" => $request->get('message')
            ]);
    }

    /**
     * @Route("/test-upload", name="app_test_upload")
     */
    public function testUpload(Request $request, FileUploader $file_uploader)
    {
        $form = $this->createForm(FileUploadType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $file = $form['upload_file']->getData();
            if ($file) {
                $file_name = $file_uploader->upload($file);
                if (null !== $file_name) // for example
                {
                    $directory = $file_uploader->getTargetDirectory();
                    $full_path = $directory . '/' . $file_name;
                    echo $full_path;
                } else {
                    // Oups, an error occured !!!
                }
            }
        }
        return $this->render('test-upload.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{reactRouting}", name="home", defaults={"reactRouting": null})
     */
    public function index(Request $request)
    {
        return $this->render('default/index.html.twig', ["headers" => $request->headers]);
    }
}