<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Mapping\OwnedTrait;
use App\Entity\Mapping\TimestampTrait;
use App\Entity\Mapping\FileTrait;
use App\Repository\FileRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\Integer;

/**
 * @ORM\Entity (repositoryClass=FileRepository::class)
 */
#[ApiResource]
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

    public function setProject(int|Project $project): self
    {
        if ($project instanceof Project) {
            $this->project = $project;
        } else {
            $this->setProjectId($project);
        }
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

    public function getData(): ?string
    {
        return $this->data;
    }

    public function setData(string $data): self
    {
        $this->data = $data;

        return $this;
    }
}
