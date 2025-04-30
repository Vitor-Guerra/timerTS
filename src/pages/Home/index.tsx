import { Play } from "@phosphor-icons/react"
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmmountInput, Separator, StartCountDownButton, TaskInput } from "./style"

export const Home = () => {
    return(
        <HomeContainer>
            <form>
                <FormContainer>
                    <label htmlFor="task"> Vou trabalhar em</label>
                    <TaskInput 
                        placeholder="Dê um nome para o seu projeto" 
                        id="task" 
                        list="task-suggestions"
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Abacaxi"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmmountInput
                        placeholder="00" 
                        type="number" 
                        id="minutesAmount" 
                        step={5}
                        min={5}
                        max={60}
                    />

                    <span>minutos</span>
                </FormContainer>


                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>
                
                <StartCountDownButton type="submit">
                    <Play size={24}/>
                    Começar
                </StartCountDownButton>
            </form>

        </HomeContainer>
    )
}