"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form} from "@/components/ui/form"
// import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/valedation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patients.actions"
// import { FormFieldType } from "./PatientForm"

const AppointmentForm=({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId, patientId, type
}:{
    userId: string;
    patientId: string;
    type: "create" | "cancel"
})=> {
    const router =useRouter();
    const [isLoading,setIsLoading]=useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name:"",
      email:"",
      phone:"",
    },
  })

  // 2. Define a submit handler.
 async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
   setIsLoading(true);
   try{
    const userData ={name, email, phone}
    const user =await createUser(userData);

    if(user) router.push(`/patients/${user.$id}/register`,)
   }catch(error){
    console.log(error)
   }
  }
  return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6 flex-1">
        <section>
            <h1 className="header">New Appointment ✍️</h1>
            <p className="text-dark-700">request a new appointment in 10 seconds</p>
        </section>
        {type !== "cancel" && (
            <>
            </>
        )}
      <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
    </form>
  </Form>
  )
}

export default AppointmentForm