import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined;
    activeCycleId: string | null; 
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    changeSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps{
    children: ReactNode;
}




export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    // usereducer é bem parecido com useState. A grande diferença é que ele recebe 2 parametros. Geralmente ele é usado quando precisa armazenar 
    // informações complexas e precise realizar ações que possam necessitar alterar parte do objeto.
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer, 
        {
            cycles: [],
            activeCycleId: null,
        },
        (initialState) => {
            const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

            if(storedStateAsJSON){
                return JSON.parse(storedStateAsJSON);
            }

            return initialState

        },
    )

    const {cycles, activeCycleId } = cyclesState

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)


    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate)
            )
        }
        
        return 0
    })

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])


    const markCurrentCycleAsFinished = () => {
        dispatch(markCurrentCycleAsFinishedAction)
    }

    const changeSecondsPassed = (seconds: number) => {
        setAmountSecondsPassed(seconds)
    }

    const createNewCycle = (data: CreateCycleData) => {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        dispatch(addNewCycleAction(newCycle))
    }

    const interruptCycle = () => {
        setAmountSecondsPassed(0)
        dispatch(interruptCurrentCycleAction())
    }


    return(
        <CyclesContext.Provider value={{ 
            cycles,
            activeCycle, 
            activeCycleId,
            markCurrentCycleAsFinished, 
            amountSecondsPassed, 
            changeSecondsPassed,
            createNewCycle,
            interruptCycle
        }}>

            {children}

        </CyclesContext.Provider>
    )
}