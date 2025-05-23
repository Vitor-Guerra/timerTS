import { useContext } from "react"
import { formatDistanceToNow} from 'date-fns'
import { ptBR } from "date-fns/locale/pt-BR"
import { HistoryContainer, HistoryList, Status } from "./style"
import { CyclesContext } from "../../contexts/CyclesContext"

export const History = () => {

    const {cycles} = useContext(CyclesContext)

    return(
        <HistoryContainer>
            <h1>Meu histórico</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Tarefa</th>
                            <th>Duração</th>
                            <th>Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => {
                            return <tr key={cycle.id}>
                                <td>{cycle.task}</td>
                                <td>{cycle.minutesAmount} minutos</td>
                                <td>{formatDistanceToNow(new Date(cycle.startDate).toISOString(), {
                                    addSuffix: true,
                                    locale: ptBR
                                })}</td>
                                <td>
                                    { cycle.finishedDate && <Status statusColor="green">Finalizado</Status>}
                                    { cycle.interruptedDate && <Status statusColor="red">Interrompido</Status>}
                                    { !cycle.interruptedDate && !cycle.finishedDate && <Status statusColor="yellow">Em Andamento</Status>}
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>

            </HistoryList>
        </HistoryContainer>
    )
}