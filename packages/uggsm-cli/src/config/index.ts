import path from 'path'

export const config = {
  githubToken: process.env.GITHUB_TOKEN,

  server: {
    serverFolder: process.env.DEPLOY_SERVER_PATH,
    serverFolderPackage: path.join(process.env.DEPLOY_SERVER_PATH, 'package.json'),
    clientFolder: process.env.DEPLOY_CLIENT_PATH,
    backupSystemFolder: process.env.DEPLOY_BACKUP_PATH,
    backupSystemFolderPackage: path.join(process.env.DEPLOY_BACKUP_PATH, 'package.json'),
  },
}

export default config
