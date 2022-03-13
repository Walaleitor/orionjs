import {Inject, Service} from '@orion-js/services'
import {log} from '../log'
import {JobsRepo} from '../repos/JobsRepo'
import {JobDefinition, JobsDefinition} from '../types/JobsDefinition'
import {JobToRun} from '../types/Worker'
import {getNextRunDate} from './getNextRunDate'

@Service()
export class Executor {
  @Inject()
  private jobsRepo: JobsRepo

  getContext(job: JobDefinition, jobToRun: JobToRun) {
    return {
      definition: job,
      record: jobToRun,
      tries: jobToRun.tries || 0,
      extendLockUntil: (lockUntil: Date) => this.jobsRepo.extendLockUntil(jobToRun.jobId, lockUntil)
    }
  }

  getJobDefinition(jobToRun: JobToRun, jobs: JobsDefinition) {
    const job = jobs[jobToRun.name]

    if (!jobToRun.isRecurrent && job.type === 'recurrent') {
      log('warn', `Job record ${jobToRun.name} is event but definition is recurrent`)
      return
    }
    if (jobToRun.isRecurrent && job.type === 'event') {
      log('warn', `Job record ${jobToRun.name} is recurrent but definition is event`)
      return
    }

    return job
  }

  async executeJob(jobs: JobsDefinition, jobToRun: JobToRun) {
    const job = this.getJobDefinition(jobToRun, jobs)
    if (!job) return
    const context = this.getContext(job, jobToRun)

    try {
      await job.resolve(jobToRun.params, context)

      if (job.type === 'recurrent') {
        await this.jobsRepo.scheduleNextRun({
          jobId: jobToRun.jobId,
          nextRunAt: getNextRunDate({runIn: job.runEvery, getNextRun: job.getNextRun}),
          addTries: false
        })
      }
    } catch (error) {
      if (!job.onError) {
        log('error', `Error executing job "${jobToRun.name}"`, error)
        return
      }

      const result = await job.onError(error, jobToRun.params, context)
      if (result.action === 'dismiss') return

      if (result.action === 'retry') {
        await this.jobsRepo.scheduleNextRun({
          jobId: jobToRun.jobId,
          nextRunAt: getNextRunDate(result),
          addTries: true
        })
      }
    }
  }
}
