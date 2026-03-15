import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Activity, Search, BookOpen, FileText,
  MessageSquare, Heart, MapPin, Pill, Shield, Brain,
  Stethoscope, Video, Settings, LogOut, Menu, X,
  AlertTriangle, ChevronRight, Bell, User, Sun, Moon,
  Cpu, FileImage, Dumbbell
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useTranslation } from 'react-i18next'

export default function MainLayout() {

  const { t } = useTranslation()

  const navGroups = [
    {
      label: t('nav.overview', 'Overview'),
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard', 'Dashboard') },
        { to: '/vitals', icon: Activity, label: t('nav.vitals', 'Vitals') },
      ],
    },
    {
      label: t('nav.aiTools', 'AI Tools'),
      items: [
        { to: '/symptom-checker', icon: Search, label: t('nav.symptomChecker', 'Symptom Checker') },
        { to: '/chat', icon: MessageSquare, label: t('nav.aiAssistant', 'AI Assistant') },
        { to: '/image-analysis', icon: FileImage, label: t('nav.imageAnalysis', 'Image Analysis') },
        { to: '/report-summarizer', icon: Cpu, label: t('nav.reportSummarizer', 'Report Summarizer') },
        { to: '/health-coach', icon: Dumbbell, label: t('nav.healthCoach', 'Health Coach') },
      ],
    },
    {
      label: t('nav.medicalLibrary', 'Medical Library'),
      items: [
        { to: '/diseases', icon: BookOpen, label: t('nav.diseases', 'Diseases') },
        { to: '/organs', icon: Brain, label: t('nav.organBrowser', 'Organ Browser') },
      ],
    },
    {
      label: t('nav.recordsAndCare', 'Records & Care'),
      items: [
        { to: '/records', icon: FileText, label: t('nav.records', 'Health Records') },
        { to: '/telemedicine', icon: Video, label: t('nav.telemedicine', 'Telemedicine') },
        { to: '/insurance', icon: Shield, label: t('nav.insurance', 'Insurance') },
      ],
    },
    {
      label: t('nav.findAndOrder', 'Find & Order'),
      items: [
        { to: '/hospitals', icon: MapPin, label: t('nav.hospitals', 'Nearby Hospitals') },
        { to: '/medicines', icon: Pill, label: t('nav.medicines', 'Medicines') },
      ],
    },
  ]

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-200 dark:border-slate-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 3v18M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-slate-800 dark:text-slate-100"
          >
            HomeCare<span className="text-blue-600">+</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            {sidebarOpen && (
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-2">
                {group.label}
              </p>
            )}

            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`
                }
                title={!sidebarOpen ? label : undefined}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Emergency Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => { navigate('/emergency'); setMobileSidebarOpen(false) }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium text-sm ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <AlertTriangle size={18} className="flex-shrink-0" />
          {sidebarOpen && 'Emergency'}
        </button>
      </div>

      {/* Settings */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-3 py-4 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <Settings size={18}/>
          {sidebarOpen && 'Settings'}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={18}/>
          {sidebarOpen && 'Logout'}
        </button>
      </div>

      {/* User Profile */}
      {sidebarOpen && user && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700"
      >
        <SidebarContent/>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={20}/>
          </button>

          <div className="flex items-center gap-2">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet/>
          </div>
        </main>

      </div>

    </div>
  )
}