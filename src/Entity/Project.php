<?php

namespace App\Entity;

use App\Entity\Mapping\OwnedTrait;
use App\Entity\Mapping\ProjectTrait;
use App\Entity\Mapping\TimestampTrait;
use App\Repository\ProjectRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\EntityManager;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;


/**
 * @ORM\Entity(repositoryClass=ProjectRepository::class)
 */
class Project
{
    use ProjectTrait, OwnedTrait, TimestampTrait;

    /**
     * Project constructor.
     */
    public function __construct(User $user, $title = '', $description = '')
    {
        $this->user = $user;
        $this->setTitle($title);
        $this->setDescription($description);
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getStartedAt(): ?DateTimeInterface
    {
        return $this->startedAt;
    }

    public function setStartedAt($startedAt): self
    {
        if (is_string($startedAt)) {
            $this->startedAt = new DateTime($startedAt);
        }
        if ($startedAt instanceof DateTimeInterface) {
            $this->startedAt = $startedAt;
        }
        return $this;
    }

    public function getTerminatedAt(): ?DateTimeInterface
    {
        return $this->terminatedAt;
    }

    public function setTerminatedAt($terminatedAt): self
    {
        if (is_string($terminatedAt)) {
            $this->terminatedAt = new DateTime($terminatedAt);
        }
        if ($terminatedAt instanceof DateTimeInterface) {
            $this->terminatedAt = $terminatedAt;
        }
        return $this;
    }

    /**
     * @Serializer\SerializedName("files")
     * @Serializer\Groups({"admin", "detail", "list"})
     * @Serializer\MaxDepth(2)
     *
     * @return Collection
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }


}
