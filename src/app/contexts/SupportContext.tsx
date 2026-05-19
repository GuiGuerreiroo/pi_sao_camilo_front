import { createContext, useState, type ReactNode } from 'react'
import type { GroupInterface } from '../interface/GroupInterface'
import { defaultSupportContext, type SupportContextInterface } from './SupportContextType'
import { get_all_groups_by_supporter as fetchAllGroups } from '../api/training/get_all_groups_by_supporter'

export const SupportContext = createContext<SupportContextInterface>(defaultSupportContext)

export const SupportContextProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<GroupInterface[] | undefined>(undefined)
  const [supportError, setSupportError] = useState<string>('')

  async function get_all_groups_by_supporter() {
    // Return cached generic groups to prevent double fetching
    if (groups !== undefined) return groups;

    try {
      const data = await fetchAllGroups()
      setGroups(data)
      return data
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      setSupportError(errorMsg)
      console.error(error)
      throw error
    }
  }

  const handleLogout = () => {
    setGroups(undefined)
    setSupportError('')
  }

  const value: SupportContextInterface = {
    get_all_groups_by_supporter,
    handleLogout,
    groups,
    supportError,
  }

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  )
}
