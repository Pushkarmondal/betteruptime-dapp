"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_BACKEND_URL } from "@/config";

interface website {
    id: string,
    url: string,
    websiteTick: {
        id: string,
        createdAt: Date,
        status: string,
        latency: number
    }[]
}

export function useWebsite() {
    const [website, setWebsite] = useState<website[]>([]);
    const {getToken} = useAuth();
    const refreshWebsites = async () => {
        const token = await getToken();
            const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
            headers: {
                Authorization: token
            }
        })  
        setWebsite(response.data.websites);
    }
    
    useEffect(()=>{
        refreshWebsites();
        const interval = setInterval(() => {
            refreshWebsites();
        }, 5000);
        return () => clearInterval(interval);
    }, [])   
    return {website, refreshWebsites};
}