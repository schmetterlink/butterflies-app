<?php
namespace App\Entity\Mapping;

use App\Entity\User;

trait OwnedTrait
{
    /**
     * @ORM\Column(name="user_id", type="integer", options={"unsigned"=true})
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }
}