import { Prescription } from "@/types/UserData"
import PillCard from "./pillCard"

interface Props {
    prescriptions: Prescription[],
    timeOfDay: string,
}

function filterPrescriptions(prescriptions: Prescription[], timeOfDay: string): Prescription[] {
    switch (timeOfDay) {
        case 'Morning':
            return prescriptions.filter((prescription) => {
                if (!prescription.recommended_time) return false;

                const [hourStr, minuteStr] = prescription.recommended_time.split(":");
                const hour = parseInt(hourStr, 10);

                if (hour >= 5 &&  hour < 12) return true;
            })
        case 'Afternoon':
            return prescriptions.filter((prescription) => {
                if (!prescription.recommended_time) return false;

                const [hourStr, minuteStr] = prescription.recommended_time.split(":");
                const hour = parseInt(hourStr, 10);

                if (hour >= 12 &&  hour < 17) return true;
            })  
        case 'Evening':
            return prescriptions.filter((prescription) => {
                if (!prescription.recommended_time) return false;

                const [hourStr, minuteStr] = prescription.recommended_time.split(":");
                const hour = parseInt(hourStr, 10);

                if (hour >= 17 &&  hour < 24) return true;
            })
        default:
            return [] 
    }
}


export default function TimeOfDay({prescriptions, timeOfDay}: Props) {
    const filteredPrescriptions = filterPrescriptions(prescriptions, timeOfDay);

    const pillCards = filteredPrescriptions.map((prescription, index) => {
        return (<PillCard key={index} prescription={prescription}></PillCard>)
    })

    return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <h2 className="text-lg font-semibold">{timeOfDay}</h2>
          <p className="text-sm text-gray-500">{filteredPrescriptions.length} medications scheduled</p>
        </div>
        <div className="p-2 space-y-2">
          {pillCards.length > 0 ? (pillCards) : (
            <p className="text-center py-2 text-gray-500 text-sm">
              No medications scheduled for {timeOfDay.toLowerCase()}
            </p>
          )}
        </div>
    </div>
  
    )
}