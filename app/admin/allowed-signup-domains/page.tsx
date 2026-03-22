"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function AllowedSignupDomainsPage() {
    const [items, setItems ] = useState<any[]>([])
    const [apexDomain, setApexDomain] = useState("")
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("allowed_signup_domains")
            .select("*")
            .order("id", {ascending: true})

        if(error){
            console.error("Error fetching allowed signup domains:", error)
            return
        }

        setItems(data || [])
    }

    async function createItem(){
        if (!apexDomain.trim()) return
        const { error } = await supabase
            .from("allowed_signup_domains")
            .insert([{
                apex_domain: apexDomain
            }])

        if(error){
            console.error("Error creating allowed signup domain:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function updateItem(id: number){
        if (!apexDomain.trim()) return

        const { error } = await supabase
            .from("allowed_signup_domains")
            .update({
                apex_domain: apexDomain
            })
            .eq("id", id)

        if(error){
            console.error("Error updating allowed signup domain:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function deleteItem(id: number){
        const { error } = await supabase
            .from("allowed_signup_domains")
            .delete()
            .eq("id", id)

        if(error){
            console.error("Error deleting allowed signup domains:", error)
            return
        }

        getItems()
        
    }

    function clearForm(){
        setApexDomain("")
        setEditingId(null)
    }


    return (
        <div>
            <h1>Allowed Signup Domains</h1>

            <input
                value={apexDomain}
                onChange={(e) => setApexDomain(e.target.value)}
                placeholder="Apex domain"
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
                    <p><strong>Apex Domain:</strong>{item.apex_domain}</p>

                    <button
                        onClick={() => {
                            setEditingId(item.id)
                            setApexDomain(item.apex_domain || "")
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