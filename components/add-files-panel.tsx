'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddFilesPanel() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length >0){
            const file = e.target.files[0];
            setSelectedFile(file)
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(selectedFile){
            const formData = new FormData()
            formData.append('file', selectedFile);
            try {
                const response = await fetch('/api/embedding/',{
                    method:'POST',
                    body:formData
                })
                if (!response.ok){
                    throw new Error(`HTTP Error: $(response.status`)
                }
                const responseData = await response.json()
                
            } catch (error) {
                console.error('Error', error)
            }
        }
    }
    const isInputEmpty = !selectedFile
    return(
        <div className="mx-auto max-w-2xl py-4 px-4">
            <div className="rounded-lg border flex flex-col space-y-4 bg-background p-8">
                <h1 className="text-lg font-semibold">
                    Embed files here
                </h1>
                <p className="text-zinc-400 text-sm">
                    Note: Only text file can be added.
                </p>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <Input 
                        type="file" 
                        accept="text/*, application/pdf"
                        onChange={handleFileChange}
                    />
                    <Button 
                        type="submit" 
                        className="disabled:opacity-25" 
                        disabled={isInputEmpty}>
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}