<?php


namespace App\Entity\Mapping;

use App\Entity\User;
use JMS\Serializer\Annotation as Serializer;

/**
 * Project
 *
 * @ORM\Table("project")
 * @Serializer\ExclusionPolicy("all")
 *
 */
trait ProjectTrait
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
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
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=250, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $startedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $terminatedAt;

    /**
     * @var \DateTime $createdAt
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     * @Serializer\SerializedName("created")
     * @Serializer\Groups({"admin", "detail"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime")
     * @Gedmo\Timestampable(on="update")
     * @Serializer\Groups({"admin"})
     *
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Serializer\SerializedName("deleted")
     * @Serializer\Groups({"admin"})
     */
    private $deletedAt;
}