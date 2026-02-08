import React from 'react'
import { 
  LayoutDashboard, 
  Brain, 
  MessageCircle, 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp,
  Video,
  PenTool,
  FileText,
  Smartphone,
  Users,
  Award,
  Accessibility,
  Glasses,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

export const LINGOGRADE_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Practice', href: '/practice', icon: <MessageCircle className="w-5 h-5" /> },
  { label: 'Review', href: '/review', icon: <Brain className="w-5 h-5" /> },
  { label: 'Exams', href: '/exam', icon: <Target className="w-5 h-5" /> },
  { label: 'Achievements', href: '/achievements', icon: <Trophy className="w-5 h-5" /> },
  { label: 'Quests', href: '/quests', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Leaderboard', href: '/leaderboard', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Progress', href: '/progress', icon: <TrendingUp className="w-5 h-5" /> },
  { label: 'Content', href: '/content', icon: <Video className="w-5 h-5" /> },
  { label: 'Writing', href: '/write', icon: <PenTool className="w-5 h-5" /> },
  { label: 'Live Classes', href: '/live-classes', icon: <Video className="w-5 h-5" /> },
  { label: 'Immersive', href: '/immersive', icon: <Glasses className="w-5 h-5" /> },
  { label: 'Certificates', href: '/certificates', icon: <Award className="w-5 h-5" /> },
  { label: 'Accessibility', href: '/accessibility', icon: <Accessibility className="w-5 h-5" /> },
  { label: 'Mobile', href: '/mobile', icon: <Smartphone className="w-5 h-5" /> },
  { label: 'Community', href: '/community', icon: <Users className="w-5 h-5" /> },
  { label: 'Team', href: '/team', icon: <Users className="w-5 h-5" /> },
]
