<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Mapping\OwnedTrait;
use App\Entity\Mapping\TimestampTrait;
use App\Repository\ApplicationRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation as Serializer;

/**
 * @ORM\Entity(repositoryClass=ApplicationRepository::class)
 */
#[ApiResource]
class Application
{
    use OwnedTrait, TimestampTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id", type="integer", options={"unsigned"=true})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="applications")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * @Serializer\Groups({"admin", "detail", "list"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Job", inversedBy="applications")
     * @ORM\JoinColumn(name="job_id", referencedColumnName="id")
     * @Serializer\Groups ({"admin", "detail"})
     */
    private $job;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Project", inversedBy="applications")
     * @ORM\JoinColumn(name="project_id", referencedColumnName="id")
     * @Serializer\Groups ({"admin", "detail"})
     */
    private $project;

    /**
     * @ORM\Column(type="string", length=180, nullable=true)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Serializer\Groups ({"admin", "detail"})
     */
    private $coverLetter;

    /**
     * @ORM\Column(type="string", length=250, nullable=true)
     * @Serializer\Groups ({"admin", "detail", "list"})
     */
    private $file;

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

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deletedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getJob(): ?Job
    {
        return $this->job;
    }

    public function setJob(Job $job): self
    {
        $this->job = $job;
        return $this;
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

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getCoverLetter(): ?string
    {
        return $this->coverLetter;
    }

    public function setCoverLetter(?string $coverLetter): self
    {
        $this->coverLetter = $coverLetter;

        return $this;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): self
    {
        $this->file = $file;

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

}
