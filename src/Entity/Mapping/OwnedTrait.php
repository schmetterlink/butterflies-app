<?php
namespace App\Entity\Mapping;

use Symfony\Component\Serializer\Annotation as Serializer;
use App\Entity\User;

trait OwnedTrait
{

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="users")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * @Serializer\Groups ({"admin", "detail"})
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
}