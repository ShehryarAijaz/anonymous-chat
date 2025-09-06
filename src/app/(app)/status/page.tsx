"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from 'react'

const StatusPage = () => {

  const [results, setResults] = useState<any>([])

//   console.log("!!OVERALL STATUS!!", results.flat())

  const flatData = results.flat()

  useEffect(() => {
    const statusCheck = async() => {
        const response = await axios.get(`/api/status`)
        if (response.data.success) {
            setResults(response.data.results)
        }
      }
      statusCheck()
  }, [])

  return (
    <div className="mx-4 my-8 p-6 md:mx-8 lg:mx-auto rounded w-full max-w-xl">
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                    <CardDescription>Check status</CardDescription>
                </CardHeader>
                <CardContent>
                   {flatData &&
                   flatData.map((result: any, index: number) => (
                    <div key={index} className="space-y-2">
                        <h3 className="text-gray-400" >{result.route}</h3>
                        <span className="text-lg">{result.status === 'UP' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}</span>
                        <span className="text-md">{result.message}</span>
                        <Separator className="my-2" />
                    </div>
                   ))}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}

export default StatusPage;