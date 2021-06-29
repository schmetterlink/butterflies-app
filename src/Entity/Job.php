<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Mapping\OwnedTrait;
use App\Entity\Mapping\TimestampTrait;
use App\Repository\JobRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=JobRepository::class)
 */
#[ApiResource]
class Job
{
    use OwnedTrait, TimestampTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id", type="integer", options={"unsigned"=true})
     * @Groups({"admin", "detail", "list"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="jobs")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * @Groups({"admin", "detail", "list"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Project", inversedBy="jobs")
     * @ORM\JoinColumn(name="project_id", referencedColumnName="id")
     * @Groups({"admin", "detail", "list"})
     */
    private $project;

    /**
     * @ORM\Column(type="string", length=80)
     * @Groups({"admin", "detail", "list"})
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     * @Groups({"admin", "detail", "list"})
     */
    private $description;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups ({"admin", "detail", "list"})
     */
    private $startedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups ({"admin", "detail", "list"})
     */
    private $terminatedAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deletedAt;

    /**
     * Job constructor.
     */
    public function __construct(User $user = null, Project $project = null, $title = '', $description = '')
    {
        $this->user = $user;
        $this->project = $project;
        $this->setTitle($title);
        $this->setDescription($description);
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(Project $project): self
    {
        $this->project = $project;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartedAt(): ?DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt(?DateTimeInterface $startedAt): self
    {
        $this->startedAt = $startedAt;

        return $this;
    }

    public function getTerminatedAt(): ?DateTimeInterface
    {
        return $this->terminatedAt;
    }

    public function setTerminatedAt(?DateTimeInterface $terminatedAt): self
    {
        $this->terminatedAt = $terminatedAt;

        return $this;
    }

    public function getDeletedAt(): ?DateTimeInterface
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTimeInterface $deletedAt): self
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function getApplications(): Collection
    {
        return $this->applications;
    }

}
