<?php

namespace Tests\Unit;

use App\Enums\CertificateStatus;
use App\Enums\LoginStage;
use App\Enums\LoginStatus;
use App\Enums\ProjectStatus;
use App\Enums\SkillCategory;
use Tests\TestCase;

class EnumsTest extends TestCase
{
    public function test_project_status_enum_has_expected_values(): void
    {
        $this->assertSame(['Completed', 'In Progress', 'Archived'], ProjectStatus::values());
        $this->assertSame('Completed', ProjectStatus::Completed->value);
        $this->assertSame('In Progress', ProjectStatus::InProgress->value);
        $this->assertSame('Archived', ProjectStatus::Archived->value);
    }

    public function test_certificate_status_enum_has_expected_values(): void
    {
        $this->assertSame(['Completed', 'In Progress', 'Expired'], CertificateStatus::values());
        $this->assertSame('Completed', CertificateStatus::Completed->value);
        $this->assertSame('In Progress', CertificateStatus::InProgress->value);
        $this->assertSame('Expired', CertificateStatus::Expired->value);
    }

    public function test_skill_category_enum_has_expected_values(): void
    {
        $this->assertSame(['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'], SkillCategory::values());
        $this->assertSame('Backend', SkillCategory::Backend->value);
        $this->assertSame('Frontend', SkillCategory::Frontend->value);
        $this->assertSame('Database', SkillCategory::Database->value);
        $this->assertSame('DevOps', SkillCategory::DevOps->value);
        $this->assertSame('Tools', SkillCategory::Tools->value);
    }

    public function test_login_stage_enum_has_expected_values(): void
    {
        $this->assertSame(['otp_sent', 'otp_verified'], LoginStage::values());
        $this->assertSame('otp_sent', LoginStage::OtpSent->value);
        $this->assertSame('otp_verified', LoginStage::OtpVerified->value);
    }

    public function test_login_status_enum_has_expected_values(): void
    {
        $this->assertSame(['success', 'failed'], LoginStatus::values());
        $this->assertSame('success', LoginStatus::Success->value);
        $this->assertSame('failed', LoginStatus::Failed->value);
    }
}
