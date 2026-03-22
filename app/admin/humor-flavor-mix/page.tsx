"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function HumorFlavorMixPage() {
    const [items, setItems ] = useState<any[]>([])
    const [captionCount, setCaptionCount ] = useState("")
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("humor_flavor_mix")
            .select("*")
            .order("id", { ascending: true })

        if(error){
            console.error("Error fetching humor flavor mix:", error)
            return
        }

        setItems(data || [])
    }

    async function updateItem(id: number){
        if (!captionCount.trim()) return 
        const { error } = await supabase
            .from("humor_flavor_mix")
            .update({ caption_count: Number(captionCount) })
            .eq("id", id)
        
        
        if(error){
            console.error("Error updating humor flavor mix:", error)
            return
        }

        clearForm()
        getItems()
    }

    function clearForm(){
        setCaptionCount("")
        setEditingId(null)
    }

    return (
        <div>
            <h1>Humor Flavor Mix</h1>
            {items.length === 0 && <p>No records found.</p>}

            {items.map((item) => (
                <div key={item.id}>
                    <p><strong>ID:</strong>{item.id}</p>
                    <p><strong>Humor Flavor ID:</strong>{item.humor_flavor_id}</p>
                    <p><strong>Caption Count:</strong>{item.caption_count}</p>

                    {editingId === item.id ? (
                        <div>
                            <input
                                type="number"
                                value={captionCount}
                                onChange={(e) => setCaptionCount(e.target.value)}
                                placeholder="Caption count"
                            />
                            <br />
                            <button onClick={() => updateItem(item.id)}>Save</button>
                            <button onClick={clearForm}>Cancel</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setEditingId(item.id)
                                setCaptionCount(String(item.caption_count ?? ""))
                            }}
                        >
                            Edit
                        </button>
                    )}

                    <hr />
                </div>
            ))}
        </div>
    )
}