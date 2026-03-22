"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"


export default function ImagesPage() {
    const [images, setImages] = useState<any[]>([])
    const [url, setUrl ] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)

    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        getImages()
    }, [])

    async function getImages() {
        const { data } = await supabase
            .from("images")
            .select("*")
        setImages(data || [])
    }

    async function uploadImage(){
        if(!file) return null

        const fileName = `${Date.now()}-${file.name}`

        const { data, error } = await supabase.storage
            .from("images")
            .upload(fileName, file)

        if (error) {
            console.error("Upload error:", error)
            return null
        }
        return data.path
    }

    async function createImage() {
        let imageUrl = url
        if (file){
            const path = await uploadImage()
            if (!path) return

            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(path)
            imageUrl = data.publicUrl

        }
        await supabase
            .from("images")
            .insert([{ url: imageUrl }])
        
        setUrl("")
        setFile(null)
        getImages()
    }

    async function updateImage(id: number) {
        await supabase
            .from("images")
            .update({ url })
            .eq("id", id)
        
        setEditingId(null)
        setUrl("")
        getImages()
    }

    async function deleteImage(id: number) {
        await supabase
            .from("images")
            .delete()
            .eq("id", id)
        
        getImages()
    }

    return (
        <div>
            <h1>Images</h1>

            <input
                type="file"
                onChange={(e) =>setFile(e.target.files?.[0] || null)}
            />

            <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Image URL"
            />

            {editingId ? (
                <button onClick={() => updateImage(editingId)}>Update</button>
            ) : (
                <button onClick={createImage}>Add Image</button>
            )}

            {images.map((image) => (
                <div key={image.id}>
                    <img src={image.url} alt="" width={200} />
                    <p>{image.url}</p>
                    <button onClick={() => {
                        setEditingId(image.id)
                        setUrl(image.url)
                    }}>
                        Edit
                    </button>
                    <button onClick={() => deleteImage(image.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}