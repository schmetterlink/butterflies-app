<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210623175533 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project ADD tags VARCHAR(255) DEFAULT NULL COMMENT \'comma_separated\' AFTER `description`;');
        $this->addSql('ALTER TABLE user ADD tags VARCHAR(255) DEFAULT NULL COMMENT \'comma_separated\' AFTER `image`;');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project DROP tags');
        $this->addSql('ALTER TABLE `user` DROP tags');
    }
}
