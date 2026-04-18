import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

interface SlideBarContextProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const SlideBarContext= createContext<SlideBarContextProps | undefined>(undefined)

export const SlideBarContextProvider =({ children } : { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <SlideBarContext.Provider
            value={{isOpen, setIsOpen}}
        >
            {children}
        </SlideBarContext.Provider>
    )
}