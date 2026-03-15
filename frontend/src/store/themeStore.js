import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: false,
      language: 'en',
      toggleTheme: () => set((s) => ({ isDark: !s.isDark })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'homecare-theme' }
  )
)
