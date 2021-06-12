<?php


namespace App\Entity\Mapping;

use App\Entity\User;
use Symfony\Component\Serializer\Annotation as Serializer;

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
     * @ORM\Column(type="integer")
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $userId;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="projects")
     */
    private $user;

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

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