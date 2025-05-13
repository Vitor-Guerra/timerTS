import { HandPalm, Play } from "@phosphor-icons/react"
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod';

import { 
    HomeContainer, 
    StartCountdownButton, 
    StopCountdownButton, 
} from "./styles"

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContext";



// validação do zod para os campos
const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a Tarefa!'),
    minutesAmount: zod.number()
        .min(1, 'Ciclo minimo de 5min')
        .max(60, 'Ciclo máximo de até 60min')
})

// como já tenho praticamente o objeto pronto e tipado no item acima, so vou reaproveitar ele aqui na interface
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export const Home = () => {

    const { activeCycle, createNewCycle, interruptCycle} = useContext(CyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const handleCreateNewCycle = (data: NewCycleFormData) => {
        
        createNewCycle(data)
        reset()
    }


    // imprimir erros de validação
    // console.log(formState.errors)
    
    // observar campo task
    const task = watch('task')
    const isSubmitDisabled = !task

    // Prop Drilling => MUITAS propriedades para comunicação entre componentes. 
    // Quando temos mais de 3 propriedades, prefira usar ContextAPI


    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
               
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <Countdown />
                
                
                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCycle} type="button">
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