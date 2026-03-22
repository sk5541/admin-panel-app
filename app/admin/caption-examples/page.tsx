"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function CaptionExamplesPage() {
    const [items, setItems ] = useState<any[]>([])
    const [imageDescription, setImageDescription] = useState("")
    const [caption, setCaption] = useState("")
    const [explanation, setExplanation] = useState("")
    const [priority, setPriority] = useState("0")
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("caption_examples")
            .select("*")
            .order("id", {ascending: true})

        if(error){
            console.error("Error fetching caption examples:", error)
            return
        }

        setItems(data || [])
    }

    async function createItem(){
        const { error } = await supabase
            .from("caption_examples")
            .insert([{
                image_description: imageDescription,
                caption: caption,
                explanation: explanation,
                priority: Number(priority)
            }])

        if(error){
            console.error("Error creating caption example:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function updateItem(id: number){
        const { error } = await supabase
            .from("caption_examples")
            .update({
                image_description: imageDescription,
                caption: caption,
                explanation: explanation,
                priority: Number(priority)
            })
            .eq("id", id)

        if(error){
            console.error("Error updating caption example:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function deleteItem(id: number){
        const { error } = await supabase
            .from("caption_examples")
            .delete()
            .eq("id", id)

        if(error){
            console.error("Error updating caption example:", error)
            return
        }

        getItems()

        
    }

    function clearForm(){
        setImageDescription("")
        setCaption("")
        setExplanation("")
        setPriority("0")
        setEditingId(null)
    }


    return (
        <div>
            <h1>Caption Examples</h1>

            <input
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="Image description"
            />
            <br />

            <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption"
            />
            <br />

            <input
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explanation"
            />
            <br />

            <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Priority"
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
                    <p><strong>Image Description:</strong>{item.image_description}</p>
                    <p><strong>Caption:</strong>{item.caption}</p>
                    <p><strong>Explanation:</strong>{item.explanation}</p>
                    <p><strong>Priority:</strong>{item.priority}</p>

                    <button
                        onClick={() => {
                            setEditingId(item.id)
                            setImageDescription(item.image_description || "")
                            setCaption(item.caption || "")
                            setExplanation(item.explanation || "")
                            setPriority(String(item.priority ?? 0))
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