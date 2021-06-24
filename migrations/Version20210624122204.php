<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210624122204 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `project` ADD FULLTEXT `fulltext_project` (`title`, `description`, `tags`);');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX `fulltext_project` ON `project`');
        // this down() migration is auto-generated, please modify it to your needs

    }
}
