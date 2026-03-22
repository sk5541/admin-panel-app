"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function LlmModelsPage() {
    const [items, setItems ] = useState<any[]>([])
    const [name, setName] = useState("")
    const [llmProviderId, setLlmProviderId] = useState("")
    const [providerModelId, setProviderModelId] = useState("")
    const [isTemperatureSupported, setIsTemperatureSupported] = useState(false)
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("llm_models")
            .select("*")
            .order("id", {ascending: true})

        if(error){
            console.error("Error fetching llm models:", error)
            return
        }

        setItems(data || [])
    }

    async function createItem(){
        const { error } = await supabase
            .from("llm_models")
            .insert([{
                name: name,
                llm_provider_id: Number(llmProviderId),
                provider_model_id: providerModelId,
                is_temperature_supported: isTemperatureSupported
            }])

        if(error){
            console.error("Error creating llm model:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function updateItem(id: number){
        const { error } = await supabase
            .from("llm_models")
            .update({
                name: name,
                llm_provider_id: Number(llmProviderId),
                provider_model_id: providerModelId,
                is_temperature_supported: isTemperatureSupported
            })
            .eq("id", id)

        if(error){
            console.error("Error updating llm model:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function deleteItem(id: number){
        const { error } = await supabase
            .from("llm_models")
            .delete()
            .eq("id", id)

        if(error){
            console.error("Error deleting llm model:", error)
            return
        }

        getItems()

        
    }

    function clearForm(){
        setName("")
        setLlmProviderId("")
        setProviderModelId("")
        setIsTemperatureSupported(false)
        setEditingId(null)
    }


    return (
        <div>
            <h1>LLM Models</h1>

            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <br />

            <input
                type="number"
                value={llmProviderId}
                onChange={(e) => setLlmProviderId(e.target.value)}
                placeholder="LLM Provider ID"
            />
            <br />

            <input
                value={providerModelId}
                onChange={(e) => setProviderModelId(e.target.value)}
                placeholder="Provider Model ID"
            />
            <br />

            <label>
                <input
                    type="checkbox"
                    checked={isTemperatureSupported}
                    onChange={(e) => setIsTemperatureSupported(e.target.checked)}
                />
                Is Temperature Supported
            </label>
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
                    <p><strong>LLM Provider ID:</strong>{item.llm_provider_id}</p>
                    <p><strong>Provider Model ID:</strong>{item.provider_model_id}</p>
                    <p><strong>Temperature Supported:</strong>{item.is_temperature_supported ? "Yes" : "No"}</p>

                    <button
                        onClick={() => {
                            setEditingId(item.id)
                            setName(item.name || "")
                            setLlmProviderId(item.llm_provider_id ?? "")
                            setProviderModelId(item.provider_model_id || "")
                            setIsTemperatureSupported(!!item.is_temperature_supported)
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