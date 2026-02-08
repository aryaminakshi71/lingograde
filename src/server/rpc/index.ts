import { authRouter } from './auth'
import { lessonsRouter } from './lessons'
import { progressRouter } from './progress'
import { speechRouter } from './speech'
import { subscriptionRouter } from './subscription'
import { adminRouter } from './admin'
import { dashboardRouter } from './dashboard'
import { examRouter } from './exam'
import { aiTutorRouter } from './ai-tutor'
import { socialRouter } from './social'
import { analyticsRouter } from './analytics'
import { spacedRepetitionRouter } from './spaced-repetition'
import { liveClassesRouter } from './live-classes'
import { nativeContentRouter } from './native-content'
import { writingAssistantRouter } from './writing-assistant'
import { communityRouter } from './community'
import {
  accessibilityRouter,
  certificationRouter,
  mobileRouter,
  corporateRouter,
  immersiveRouter
} from './enhanced-features'

export const appRouter = {
  auth: authRouter,
  lessons: lessonsRouter,
  progress: progressRouter,
  speech: speechRouter,
  subscription: subscriptionRouter,
  admin: adminRouter,
  dashboard: dashboardRouter,
  exam: examRouter,
  aiTutor: aiTutorRouter,
  social: socialRouter,
  analytics: analyticsRouter,
  spacedRepetition: spacedRepetitionRouter,
  liveClasses: liveClassesRouter,
  nativeContent: nativeContentRouter,
  writingAssistant: writingAssistantRouter,
  community: communityRouter,
  accessibility: accessibilityRouter,
  certification: certificationRouter,
  mobile: mobileRouter,
  corporate: corporateRouter,
  immersive: immersiveRouter,
}

export type AppRouter = typeof appRouter
