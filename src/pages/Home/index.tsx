import { HandPalm, Play } from "@phosphor-icons/react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns'


import { 
    CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    MinutesAmmountInput, 
    Separator, 
    StartCountdownButton, 
    StopCountdownButton, 
    TaskInput 
} from "./styles"


// validação do zod para os campos
const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a Tarefa!'),
    minutesAmmount: zod.number()
        .min(5, 'Ciclo minimo de 5min')
        .max(60, 'Ciclo máximo de até 60min')
})


// como já tenho praticamente o objeto pronto e tipado no item acima, so vou reaproveitar ele aqui na interface
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmmount: number;
    startDate: Date
    interruptedDate?: Date
}

export const Home = () => {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [ammountSecondsPassed, setAmmountSecondsPassed] = useState<number>(0)
    
    
    // constrolled para poucos inputs | Uncontrolled para muitos inputs

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmmount: 0,
        }
    })

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)


    useEffect(() => {
        /* 
            como o interval não passa o valor exato, mas uma estimativa,
            foi necessário usar bibliotecas que calculem a diferenca do tempo inciado
            até o tempo da mudanca e descontar o valor correto dos segundos que passaram
        */
        
        let interval: number;
        if (activeCycle){
            interval = setInterval(() => {
                setAmmountSecondsPassed(
                    differenceInSeconds(new Date(), activeCycle.startDate)
                )
            }, 1000)
        }

        return () => {
            clearInterval(interval)
            setAmmountSecondsPassed(0)
        }
    }, [activeCycle])

    /* 
    a funcao register faz basicamente o que está aqui
        function register(name: string) {
            return{
                onChange: () => void,
                onBlur: () => void,
                onFocus: () => void...
            }
        }
    */

    const handleCreateNewCycle = (data: NewCycleFormData) => {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmmount: data.minutesAmmount,
            startDate: new Date()
        }

        setCycles((prevCycles) => [...prevCycles, newCycle])
        setActiveCycleId(newCycle.id)

        reset()
    }

    const handleInterruptCycle = () => {
        setCycles(
            cycles.map(cycle => {
                if(cycle.id === activeCycleId) {
                    return {
                        ...cycle,
                        interruptedDate: new Date()
                    }
                }else{
                    return cycle
                }
            }),
        )

        setActiveCycleId(null)

    }



    const totalSeconds = activeCycle ? activeCycle.minutesAmmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - ammountSecondsPassed : 0

    const minutesAmmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds])

    // imprimir erros de validação
    // console.log(formState.errors)
    
    // observar campo task
    const task = watch('task')
    const isSubmitDisabled = !task


    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task"> Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto" 
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Abacaxi"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmmountInput
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00" 
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmmount', { valueAsNumber: true })}
                    />

                    <span>minutos</span>
                </FormContainer>


                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>
                
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24}/>
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
                        <Play size={24}/>
                        Começar
                    </StartCountdownButton>
                )}
            </form>

        </HomeContainer>
    )
}