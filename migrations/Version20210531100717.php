<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210531100717 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project ADD terminated_at DATETIME DEFAULT NULL AFTER `description`, ADD started_at  DATETIME DEFAULT NULL AFTER `description`, DROP start_at, DROP terminate_at');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project ADD start_at DATETIME DEFAULT NULL, ADD terminate_at DATETIME DEFAULT NULL, DROP started_at, DROP terminated_at');
    }
}
