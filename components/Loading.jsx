import React from 'react'
import Image from 'next/image'
import Link from "next/link"


import { Button } from "@/components/ui/button"


function Loading() {
  return (
     <div className="relative pt-16 h-[80vh] animate-pulse">
          <Image
            src="w"
            alt="nonw"
            fill
            className="object-cover bg-gray-200"
            priority
          />
          <div className="absolute   inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute   bottom-0 left-0 p-8 md:p-16 w-full md:w-1/2 space-y-4">
            <div className="flex w-[30%]  rounded   bg-gray-200 items-center gap-2 text-sm">
              <span className=" px-2 py-0.5 rounded text-xs  bg-gray-200  capitalize"></span>
              <span className=" bg-gray-100 capitalize"></span>
              <span className=" h-3 w-4"></span>
              <span className=" bg-gray-200" style={{background:" hsla(0, 0%, 100%, .2)", padding:"0px 3px", borderRadius:"4px"}}></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold h-[20px] rounded bg-gray-200"></h1>
            <p className="text-sm md:text-base  bg-gray-200 h-[40px] rounded text-gray-300">
         
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Button className=" w-[30%]  bg-gray-200 hover:bg-blue-700 rounded-full px-6" asChild>
                <Link href="">
                 
                  
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full w-[40%]  bg-gray-200 text-black hover:bg-gray-800">
               
                
              </Button>
            </div>
          </div>
        </div>
  )
}

export default Loading