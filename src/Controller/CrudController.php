<?php


namespace App\Controller;

use App\Entity;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Entity\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\VarDumper\VarDumper;

class CrudController extends AbstractController
{
    /**
     * @Route("/api/project", name="api_crud_add", methods={"POST"})
     */
    public function add(Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();

        /** @var Entity\Project $project */
        $project = new Entity\Project($user);

        $values = $request->request->all() ?: $request->toArray();

        foreach ($values as $key=>$value) {
            $methodName = "set".ucfirst($key);
            $project->$methodName($value);
        }
        $project->setUserId($user->getId());

        $manager->persist($project);
        $manager->flush();
        return new JsonResponse($project->getId());
    }
    /**
     * @Route("/api/{entity}/{id}", name="api_crud_delete", methods={"DELETE"})
     */
    public function delete(string $entity, string $id, Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();

        $id = $id ?: $request->request->get('id',$request->get('id'));
        $entity = $entity ?: $request->request->get('entity',$request->get('entity'));

        /** @var Entity\Project $project */
        $project = $this->getDoctrine()->getRepository(Entity\Project::class)->find($id);

        $manager->remove($project);
        $manager->flush();
        return new JsonResponse([]);
    }
}