<?php


namespace App\Controller;

use App\Entity;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Entity\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Validator\Constraints\Json;
use Symfony\Component\Validator\Mapping\MetadataInterface;
use Symfony\Component\Validator\Mapping\PropertyMetadata;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\VarDumper\VarDumper;

class CrudController extends AbstractController
{
    /**
     * @Route("/api/{entityName}", name="api_crud_add", methods={"POST"})
     */
    public function add(string $entityName, Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();

        $entityClassName = $this->getEntityClassName($entityName);

        /** @var \Doctrine\ORM\Mapping\Entity $entity */
        $entity = new $entityClassName($user);

        $values = $request->request->all() ?: $request->toArray();

        foreach ($values as $key=>$value) {
            $methodName = "set".ucfirst($key);
            $entity->$methodName($value);
        }

        if (method_exists($entity, "setUserId")) {
            $entity->setUserId($user->getId());
        }

        /** TODO: check permissions and ownership before creating entity */
        $manager->persist($entity);
        $manager->flush();
        return new JsonResponse($entity);
    }

    /**
     * @Route("/api/meta/{entityName}/{fieldName}", name="api_crud_get_meta", methods={"GET"}, defaults={"fieldName"=""})
     */
    public function getMetaData(string $entityName, string $fieldName, EntityManagerInterface $em, ValidatorInterface $validator):JsonResponse {
        $entityClassName = $this->getEntityClassName($entityName);

        /** @var ClassMetadata $meta */
        $meta = $em->getClassMetadata($entityClassName);

        $mappings = $meta->fieldMappings;

        /** @var MetadataInterface $constraints */
        $constraints = $validator->getMetadataFor($entityClassName);
        /**
         * @var  $field
         * @var PropertyMetadata $propertyMeta
         */

        foreach ($constraints->members as $field => $propertyMetaList) {
            foreach ($propertyMetaList as $propertyMeta) {
                foreach($propertyMeta->constraints as $constraint) {

                    $mappings[$field]['constraints'][$constraint::class] = $constraint;
                }
            }
        }

        return new JsonResponse($fieldName ? $mappings[$fieldName] : $mappings, 200);
    }

    /**
     * @Route("/api/{entityName}/{id}", name="api_crud_update", methods={"PUT"})
     */
    public function update(string $entityName, string $id, Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();

        //$entity = Entity\Project::class;
        $entityClassName = $this->getEntityClassName($entityName);

        /** @var \Doctrine\ORM\Mapping\Entity $entity */
        $entity = $this->getDoctrine()->getRepository($entityClassName)->find($id);

        if (!$entity) {
            return new JsonResponse(["error"=>"resource is not available"], 404);
        }

        $values = $request->request->all() ?: $request->toArray();

        if (isset($values['id']) && $values['id'] != $entity->getId()) {
            return new JsonResponse(["error"=>"data manipulation error: primary keys may not be altered"], 400);
        }

        foreach ($values as $key=>$value) {
            $methodName = "set".ucfirst($key);
            try {
                if (method_exists($entity, $methodName)) {
                    $entity->$methodName($value);
                }
            } catch (\Exception $e) {

            }
        }
        if (method_exists($entity, "setUserId")) {
            $entity->setUserId($user->getId());
        }

        /** TODO: check permissions and ownership before updating entity */
        $manager->persist($entity);
        $manager->flush();
        return new JsonResponse($entity, 201);

    }
    private function getEntityClassName($entityName):? string {
        if (substr($entityName,0,1) === "\\") {
            return $entityName;
        }
        $entityClassName = "\App\Entity\\".ucfirst($entityName);
        if (!class_exists($entityClassName)) {
            $entityClassName = "\Entity\\".ucfirst($entityName);
        }
        return $entityClassName;
    }
    /**
     * @Route("/api/{entityName}/{id}", name="api_crud_delete", methods={"DELETE"})
     */
    public function delete(string $entityName, string $id, Request $request, TokenStorageInterface $tokenStorage, EntityManagerInterface $manager):JsonResponse
    {
        /** @var Entity\User $user */
        $user = $tokenStorage->getToken()->getUser();

        $id = $id ?: $request->request->get('id',$request->get('id'));
        $entityName = $entityName ?: $request->request->get('entityName',$request->get('entityName'));

        //$entity = Entity\Project::class;
        $entityClassName = $this->getEntityClassName($entityName);

        /** @var Entity\Project $project */
        $project = $this->getDoctrine()->getRepository($entityClassName)->find($id);

        /** TODO: check permissions and ownership before deleting entity */
        $manager->remove($project);
        $manager->flush();
        return new JsonResponse([]);
    }
}