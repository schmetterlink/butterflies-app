<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210622184325 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE file CHANGE uri data VARCHAR(255) NOT NULL COMMENT \'uploaded_file\'');
        $this->addSql('ALTER TABLE user CHANGE image_url image VARCHAR(250) DEFAULT NULL COMMENT \'uploaded_file\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE file CHANGE data uri VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'uploaded_file\'');
        $this->addSql('ALTER TABLE `user` CHANGE image image_url VARCHAR(250) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'uploaded_file\'');
    }
}
