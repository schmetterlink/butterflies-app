<?php


namespace App\Entity\Mapping;


trait OwnedTrait
{

    /**
     * @ORM\Column(type="integer")
     */
    private $userId;

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): self
    {
        $this->userId = $userId;

        return $this;
    }
}