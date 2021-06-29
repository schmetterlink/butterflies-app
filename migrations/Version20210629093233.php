<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210629093233 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE application ADD CONSTRAINT FK_A45BDDC1BE04EA9 FOREIGN KEY (job_id) REFERENCES job (id)');
        $this->addSql('ALTER TABLE application ADD CONSTRAINT FK_A45BDDC1166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('CREATE INDEX IDX_A45BDDC1BE04EA9 ON application (job_id)');
        $this->addSql('CREATE INDEX IDX_A45BDDC1166D1F9C ON application (project_id)');
        $this->addSql('ALTER TABLE job ADD CONSTRAINT FK_FBD8E0F8166D1F9C FOREIGN KEY (project_id) REFERENCES project (id)');
        $this->addSql('CREATE INDEX IDX_FBD8E0F8166D1F9C ON job (project_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE application DROP FOREIGN KEY FK_A45BDDC1BE04EA9');
        $this->addSql('ALTER TABLE application DROP FOREIGN KEY FK_A45BDDC1166D1F9C');
        $this->addSql('DROP INDEX IDX_A45BDDC1BE04EA9 ON application');
        $this->addSql('DROP INDEX IDX_A45BDDC1166D1F9C ON application');
        $this->addSql('ALTER TABLE job DROP FOREIGN KEY FK_FBD8E0F8166D1F9C');
        $this->addSql('DROP INDEX IDX_FBD8E0F8166D1F9C ON job');
    }
}
