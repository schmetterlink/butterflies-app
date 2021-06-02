<?php


namespace App\Controller;

use App\Entity;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\VarDumper\VarDumper;

class CrudController
{
    /**
     * @Route("/api/project", name="api_crud_add", methods={"POST"})
     */
    public function add(Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();
        $uid = $user->getId();

        /** @var Entity\Project $project */
        $project = new Entity\Project();

        $values = $request->request->all() ?: $request->toArray();

        foreach ($values as $key=>$value) {
            $methodName = "set".ucfirst($key);
            $project->$methodName($value);
        }
        $project->setUserId($uid);

        $manager->persist($project);
        $manager->flush();
        return new JsonResponse($project->getId());
    }
}