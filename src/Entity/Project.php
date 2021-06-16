<?php

namespace App\Entity;

use App\Entity\Mapping\TimestampTrait;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManager;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity(repositoryClass=ProjectRepository::class)
 */
class Project
{
    use Mapping\ProjectTrait, TimestampTrait;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): self
    {
        $this->userId = $userId;

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

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getStartedAt(): ?\DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt($startedAt): self
    {
        if (is_string($startedAt)) {
            $this->startedAt = new \DateTime($startedAt);
        }
        if ($startedAt instanceof \DateTimeInterface) {
            $this->startedAt = $startedAt;
        }
        return $this;
    }

    public function getTerminatedAt(): ?\DateTimeInterface
    {
        return $this->terminatedAt;
    }

    public function setTerminatedAt($terminatedAt): self
    {
        if (is_string($terminatedAt)) {
            $this->terminatedAt = new \DateTime($terminatedAt);
        }
        if ($terminatedAt instanceof \DateTimeInterface) {
            $this->terminatedAt = $terminatedAt;
        }
        return $this;
    }

    /**
     * Project constructor.
     */
    public function __construct(User $user, $title = '', $description = '')
    {
        $this->user = $user;
        $this->setTitle($title);
        $this->setDescription($description);
    }
}
