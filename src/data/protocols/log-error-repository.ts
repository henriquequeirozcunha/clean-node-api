export interface LogErrorRepository {
  log: (errorStack: string) => Promise<void>
}
