"use client"
import CountdownTimer from "../components/CountdownTimer";
import { useRouter } from "next/navigation";




export default function Countdown() {
    const router = useRouter()

    return(
        <CountdownTimer matchTimeMinutes={0} matchTimeSeconds={3} whenFinished={() =>{
            router.push("/action-screen")
        }}/>
    );
}