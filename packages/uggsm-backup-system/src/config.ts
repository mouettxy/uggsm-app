export default {
  token: process.env.YAPI_TOKEN,

  paths: {
    root: '/uggsm-backup-system',
    automatic: '/automatic-backups',
    custom: '/custom-backups',
    database: '/database',
    server: '/server',
    databaseDaily: '/daily',
    databaseMonthly: '/monthly',
    databaseWeekly: '/weekly',

    fullCustom: '/uggsm-backup-system/custom-backups/database',

    fullAutomaticDaily: '/uggsm-backup-system/automatic-backups/database/daily',
    fullAutomaticWeekly: '/uggsm-backup-system/automatic-backups/database/weekly',
    fullAutomaticMonthly: '/uggsm-backup-system/automatic-backups/database/monthly',
  },
}
