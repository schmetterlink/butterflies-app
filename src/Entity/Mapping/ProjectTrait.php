<?php


namespace App\Entity\Mapping;

use App\Entity\User;
use Symfony\Component\Serializer\Annotation as Serializer;
use App\Entity\Project;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Project
 *
 * @ORM\Table("project")
 *
 */
trait ProjectTrait
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id", type="integer", options={"unsigned"=true})
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="projects")
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=60)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=250, nullable=true)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $description;

    /**
     * @ORM\Column(name="tags", type="string", length=255, nullable=true, options={"comment":"comma_separated"})
     * @Groups ({"admin", "detail", "list"})
     */
    private $tags;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Job", mappedBy="project", fetch="EAGER")
     * @Groups ({"admin", "detail"})
     */
    private $jobs;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Application", mappedBy="project", fetch="EAGER")
     * @Groups ({"admin", "detail"})
     */
    private $applications;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\File", mappedBy="project", fetch="EAGER")
     * @Groups ({"admin", "detail"})
     */
    private $files;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $startedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $terminatedAt;

}