export interface LogErrorRepository {
  logError: (errorStack: string) => Promise<void>
}
