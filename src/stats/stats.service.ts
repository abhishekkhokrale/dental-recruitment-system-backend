import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class StatsService {
  constructor(private dataSource: DataSource) {}

  async getAdminStats() {
    const db = this.dataSource

    const [
      usersRow,
      newUsersRow,
      activeJobsRow,
      clinicsRow,
      appsThisMonthRow,
      newClinicsRow,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) AS count FROM users WHERE deletedat IS NULL`),
      db.query(`SELECT COUNT(*) AS count FROM users WHERE deletedat IS NULL AND createdat >= date_trunc('month', CURRENT_DATE)`),
      db.query(`SELECT COUNT(*) AS count FROM jobs WHERE isactive = true AND deletedat IS NULL`),
      db.query(`SELECT COUNT(*) AS count FROM clinics WHERE deletedat IS NULL`),
      db.query(`SELECT COUNT(*) AS count FROM applications WHERE deletedat IS NULL AND appliedat >= date_trunc('month', CURRENT_DATE)`),
      db.query(`SELECT COUNT(*) AS count FROM clinics WHERE deletedat IS NULL AND createdat >= date_trunc('month', CURRENT_DATE)`),
    ])

    return {
      totalUsers:             parseInt(usersRow[0].count),
      newUsersThisMonth:      parseInt(newUsersRow[0].count),
      activeJobs:             parseInt(activeJobsRow[0].count),
      totalClinics:           parseInt(clinicsRow[0].count),
      thisMonthApplications:  parseInt(appsThisMonthRow[0].count),
      newClinicsThisMonth:    parseInt(newClinicsRow[0].count),
    }
  }

  async getClinicStats(userId: string) {
    const db = this.dataSource

    // Get clinic ID for this user
    const clinicRows = await db.query(
      `SELECT id FROM clinics WHERE userid = $1 AND deletedat IS NULL LIMIT 1`,
      [userId],
    )
    if (!clinicRows.length) {
      return { activeJobs: 0, thisMonthApplications: 0, inProgressApplications: 0, totalViewCount: 0, recentApplications: [], activeJobsList: [] }
    }
    const clinicId = clinicRows[0].id

    const [activeJobsRow, viewCountRow, appsThisMonthRow, inProgressRow, recentApps, activeJobs] =
      await Promise.all([
        db.query(`SELECT COUNT(*) AS count FROM jobs WHERE clinicid = $1 AND isactive = true AND deletedat IS NULL`, [clinicId]),
        db.query(`SELECT COALESCE(SUM(viewcount), 0) AS total FROM jobs WHERE clinicid = $1 AND deletedat IS NULL`, [clinicId]),
        db.query(
          `SELECT COUNT(*) AS count FROM applications a
           JOIN jobs j ON j.id = a.jobid
           WHERE j.clinicid = $1 AND a.deletedat IS NULL AND a.appliedat >= date_trunc('month', CURRENT_DATE)`,
          [clinicId],
        ),
        db.query(
          `SELECT COUNT(*) AS count FROM applications a
           JOIN jobs j ON j.id = a.jobid
           WHERE j.clinicid = $1 AND a.deletedat IS NULL AND a.status IN ('applied','reviewing','interview')`,
          [clinicId],
        ),
        db.query(
          `SELECT a.id, a.status, a.appliedat, u.name AS seekername, j.title AS jobtitle
           FROM applications a
           JOIN users u ON u.id = a.seekerid
           JOIN jobs j ON j.id = a.jobid
           WHERE j.clinicid = $1 AND a.deletedat IS NULL
           ORDER BY a.appliedat DESC LIMIT 6`,
          [clinicId],
        ),
        db.query(
          `SELECT id, title, jobtype, isactive, viewcount, applicationcount, postedat
           FROM jobs WHERE clinicid = $1 AND deletedat IS NULL ORDER BY postedat DESC LIMIT 8`,
          [clinicId],
        ),
      ])

    return {
      activeJobs:            parseInt(activeJobsRow[0].count),
      totalViewCount:        parseInt(viewCountRow[0].total),
      thisMonthApplications: parseInt(appsThisMonthRow[0].count),
      inProgressApplications: parseInt(inProgressRow[0].count),
      recentApplications: recentApps.map((a: any) => ({
        id: a.id,
        seekerName: a.seekername,
        jobTitle: a.jobtitle,
        status: a.status,
        appliedAt: a.appliedat,
      })),
      activeJobsList: activeJobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        jobType: j.jobtype,
        isActive: j.isactive,
        viewCount: parseInt(j.viewcount),
        applicationCount: parseInt(j.applicationcount),
        postedAt: j.postedat,
      })),
    }
  }
}
