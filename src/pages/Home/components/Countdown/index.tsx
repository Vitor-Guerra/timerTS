import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles"
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";


export const Countdown = () => {
    const { 
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed,
        changeSecondsPassed

     } = useContext(CyclesContext)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        } else {
            document.title = "Ignite Timer"
        }
    }, [minutes, seconds, activeCycle])
    


    useEffect(() => {
        /* 
            como o interval não passa o valor exato, mas uma estimativa,
            foi necessário usar bibliotecas que calculem a diferenca do tempo inciado
            até o tempo da mudanca e descontar o valor correto dos segundos que passaram
        */
        
        let interval: number;
        if (activeCycle){
            interval = setInterval(() => {

                const secondsDifference = differenceInSeconds(
                    new Date(),
                    new Date(activeCycle.startDate)
                )

                if(secondsDifference >= totalSeconds){
                    
                    changeSecondsPassed(0)
                    clearInterval(interval)
                    markCurrentCycleAsFinished()

                }else{
                    changeSecondsPassed(secondsDifference)
                }

            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId])

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
    

    return( 
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}