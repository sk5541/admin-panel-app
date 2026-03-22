"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function LlmModelsPage() {
    const [items, setItems ] = useState<any[]>([])
    const [name, setName] = useState("")
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("llm_providers")
            .select("*")
            .order("id", {ascending: true})

        if(error){
            console.error("Error fetching llm providers:", error)
            return
        }

        setItems(data || [])
    }

    async function createItem(){
        if (!name.trim()) return
        const { error } = await supabase
            .from("llm_providers")
            .insert([{
                name
            }])

        if(error){
            console.error("Error creating llm provider:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function updateItem(id: number){
        if (!name.trim()) return

        const { error } = await supabase
            .from("llm_providers")
            .update({
                name
            })
            .eq("id", id)

        if(error){
            console.error("Error updating llm provider:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function deleteItem(id: number){
        const { error } = await supabase
            .from("llm_providers")
            .delete()
            .eq("id", id)

        if(error){
            console.error("Error deleting llm provider:", error)
            return
        }

        getItems()
        
    }

    function clearForm(){
        setName("")
        setEditingId(null)
    }


    return (
        <div>
            <h1>LLM Providers</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Provider name"
            />
            <br />


            {editingId ? (
                <button onClick={() => updateItem(editingId)}>Update</button>
            ) : (
                <button onClick={createItem}>Add</button>
            )}
            <button onClick={clearForm}>Clear</button>

            {items.length === 0 && <p>No records found.</p>}

            {items.map((item) => (
                <div key={item.id}>
                    <p><strong>ID:</strong>{item.id}</p>
                    <p><strong>Name:</strong>{item.name}</p>

                    <button
                        onClick={() => {
                            setEditingId(item.id)
                            setName(item.name || "")
                        }}
                    >
                        Edit
                    </button>

                    <button onClick={() => deleteItem(item.id)}>
                        Delete
                    </button>

                    <hr />
                </div>
            ))}
        </div>
    )
}