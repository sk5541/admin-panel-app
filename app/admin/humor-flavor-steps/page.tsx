"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function HumorFlavorsStepsPage() {
    const [items, setItems ] = useState<any[]>([])

    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("humor_flavor_steps")
            .select("*")

        if(error){
            console.error("Error fetching humor flavor steps:", error)
            return
        }

        setItems(data || 0)
    }

    return (
        <div>
            <h1>Humor Flavor Steps</h1>
            {items.length === 0 && <p>No records found.</p>}
            {items.map((item) => (
                <div key={item.id}>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                    <hr />
                </div>
            ))}
    
        </div>
    )
}