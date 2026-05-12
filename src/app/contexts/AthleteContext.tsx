import type { TrainingInterface } from '../interface/TrainingInterface'
import type { UserInterface } from '../interface/UserInterface'
import { defaultAthleteContext, type AthleteContextInterface } from './AthleteContextType'
import { createContext, useState, type ReactNode } from 'react'
import axios from 'axios'
import { AthleteRepositoryHttp } from '../repositories/AthleteRepositoryHttp'

const http = axios.create()
const athleteRepository = new AthleteRepositoryHttp(http)

export const AthleteContext = createContext<AthleteContextInterface>(defaultAthleteContext)

export const AthleteContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface | undefined>(undefined)

  const [trainings, setTrainings] = useState<TrainingInterface[] | undefined>(undefined)
  
  const [athleteError, setAthleteError] = useState<string>('')

  async function getUser() {
    try {
      const user = await athleteRepository.getUser()
      setUser(user)
      return user
    } catch (error: any) {
      setAthleteError(error.message)
      console.error(error)
      throw error
    }
  }

  async function get_all_trainings() {
    try {
      const trainings = await athleteRepository.get_all_trainings()
      setTrainings(trainings)
      return trainings
    } catch (error: any) {
      setAthleteError(error.message)
      console.error(error)
      throw error
    }
  }

  const handleLogout = () => {
    setUser(undefined)
    setTrainings(undefined)
    setAthleteError('')
  }

  const value: AthleteContextInterface = {
    getUser,
    get_all_trainings,
    handleLogout,
    user,
    trainings,
    athleteError,
  }

  return (
    <AthleteContext.Provider value={value}>
      {children}
    </AthleteContext.Provider>
  )
}
