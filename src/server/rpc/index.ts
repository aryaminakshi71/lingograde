import { router } from '@orpc/server'
import { authRouter } from './auth'
import { lessonsRouter } from './lessons'
import { progressRouter } from './progress'
import { speechRouter } from './speech'
import { subscriptionRouter } from './subscription'
import { adminRouter } from './admin'
import { dashboardRouter } from './dashboard'

export const appRouter = router({
  auth: authRouter,
  lessons: lessonsRouter,
  progress: progressRouter,
  speech: speechRouter,
  subscription: subscriptionRouter,
  admin: adminRouter,
  dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
