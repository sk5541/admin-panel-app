"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function WhitelistEmailAddressesPage() {
    const [items, setItems ] = useState<any[]>([])
    const [emailAddress, setEmailAddress] = useState("")
    const [editingId, setEditingId ] = useState<number | null>(null)


    useEffect(() => {
        getItems()
    }, [])

    async function getItems() {
        const { data, error } = await supabase
            .from("whitelist_email_addresses")
            .select("*")
            .order("id", {ascending: true})

        if(error){
            console.error("Error fetching whitelist email addresses:", error)
            return
        }

        setItems(data || [])
    }

    async function createItem(){
        if (!emailAddress.trim()) return
        const { error } = await supabase
            .from("whitelist_email_addresses")
            .insert([{
                email_address: emailAddress
            }])

        if(error){
            console.error("Error creating whitelist email addresses:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function updateItem(id: number){
        if (!emailAddress.trim()) return

        const { error } = await supabase
            .from("whitelist_email_addresses")
            .update({
                email_address: emailAddress
            })
            .eq("id", id)

        if(error){
            console.error("Error updating whitelist email addresses:", error)
            return
        }

        clearForm()
        getItems()
    }

    async function deleteItem(id: number){
        const { error } = await supabase
            .from("whitelist_email_addresses")
            .delete()
            .eq("id", id)

        if(error){
            console.error("Error deleting whitelist email addresses:", error)
            return
        }

        getItems()
        
    }

    function clearForm(){
        setEmailAddress("")
        setEditingId(null)
    }


    return (
        <div>
            <h1>Whitelist Email Addresses</h1>

            <input
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Email address"
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
                    <p><strong>Email Address:</strong>{item.email_address}</p>

                    <button
                        onClick={() => {
                            setEditingId(item.id)
                            setEmailAddress(item.email_address || "")
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