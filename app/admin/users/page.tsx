"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function UsersPage() {
    const [users, setUsers ] = useState<any[]>([])
    const [loading, setLoading ] = useState(true)

    useEffect(() => {
        getUsers()
    }, [])

    async function getUsers() {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("id", { ascending: true })

        if (error){
            console.error("Error fetching users:", error)
            setLoading(false)
            return
        }

        setUsers(data || [])
        setLoading(false)
    }
    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h1>Users</h1>
            {users.length === 0 && <p>No users found</p>}
            {users.map((user) => (
                <div key={user.id}>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                    
                    <hr/>
                </div>
            ))}
        </div>
    )
}