<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Mapping\OwnedTrait;
use App\Entity\Mapping\TimestampTrait;
use App\Entity\Mapping\FileTrait;
use App\Repository\FileRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity (repositoryClass=FileRepository::class)
 */
class File
{
    use FileTrait, OwnedTrait, TimestampTrait;

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

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function setProjectId(int $projectId): self
    {
        $this->projectId = $projectId;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
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

    public function getUri(): ?string
    {
        return $this->uri;
    }

    public function setUri(string $uri): self
    {
        $this->uri = $uri;

        return $this;
    }
}
