'use client'

import { Prescription } from "@/types/UserData"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase/client"
import { toast } from "sonner"

interface Props {
    prescription: Prescription,
}

function formatDateToCustomUTC(date: Date): string {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds()
  
    return (
      year + "-" +
      (month < 10 ? "0" + month : month) + "-" +
      (day < 10 ? "0" + day : day) + " " +
      (hours < 10 ? "0" + hours : hours) + ":" +
      (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds < 10 ? "0" + seconds : seconds) + "+00"
    )
}

export default function PillCard({prescription}: Props) {

    const [isChecked, setIsChecked] = useState<boolean>();
    const [newlastTaken, setNewLastTaken] = useState<string>(prescription.last_taken_at!);

    useEffect(() => {
        if (prescription.last_taken_at) {
          const takenDate = new Date(prescription.last_taken_at);
          const now = new Date();
    
          const isSamePastDay =
            takenDate.getFullYear() >= now.getFullYear() &&
            takenDate.getMonth() >= now.getMonth() &&
            takenDate.getDate() >= now.getDate();
        
          setIsChecked(isSamePastDay);
    }}, [prescription.last_taken_at])

    async function handleCheck() {
        if (!isChecked) {
            setIsChecked(true)
            const now = new Date()
            const formattedDate = formatDateToCustomUTC(now);
            const response = await supabase.from('prescriptions').update({'last_taken_at': formattedDate}).eq('patient', 6).eq('id', prescription.id);
            if (response.error) {
                toast.error('Something went wrong checking off:' + prescription.medication)
            } else {
                toast.success('Successfully checked ' + prescription.medication);
                setNewLastTaken(formattedDate);
            }
        }
    }
    
    
    return (
        <div className={`border shadow-md flex items-center space-x-4 ${isChecked ? "bg-green-50" : "bg-white"} rounded-lg p-4 space-y-3`}>
            <div>
                <Checkbox 
                    checked={isChecked}
                    onClick={handleCheck}
                />
            </div>
            <div >
                <div className="flex flex-col">
                    <div className="">
                        <div
                            className={`font-medium text-lg cursor-pointer ${isChecked ? "line-through text-muted-foreground" : ""}`}
                        >
                            {prescription.medication ? prescription.medication : 'No name'}
                        </div>
                        <div className="">Recommended Time: {prescription.recommended_time}</div>
                    </div>
                    <div className="text-md flex items-center gap-1 pb-1">
                        {prescription.amount}mg - {prescription.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Last taken at: {newlastTaken}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Refill Time: {prescription.refill_time}
                    </div>
                </div>
            </div>
        </div>
    )
}