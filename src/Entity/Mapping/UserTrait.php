<?php


namespace App\Entity\Mapping;


use App\Entity\File;
use App\Entity\Project;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation as Serializer;
use Gedmo\Mapping\Annotation as Gedmo;


trait UserTrait
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(name="id", type="integer", options={"unsigned"=true})
     * @Groups ({"admin", "list", "detail"})
     *
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups ({"admin", "list", "detail", "edit"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups ({"admin"})
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Groups ({"admin"})
     */
    private $password;

    /**
     * @var string The display name
     * @ORM\Column(type="string", length=40, unique=false, nullable=true)
     * @Groups ({"admin", "detail", "list", "edit"})
     */
    private $name;


    /**
     * @ORM\Column(name="image_url", type="string", length=250, nullable=true, options={"comment":"uploaded_file"})
     * @Groups ({"admin", "detail", "list", "edit"})
     */
    private $imageUrl;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Project", mappedBy="user", fetch="EAGER")
     * @Groups ({"admin", "detail"})
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\File", mappedBy="user", fetch="EAGER")
     * @Groups ({"admin", "detail"})
     */
    private $files;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
        $this->files = new ArrayCollection();
    }

    /**
     * @return Collection|Project[]
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    /**
     * @return Collection|File[]
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

}