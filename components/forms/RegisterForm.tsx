"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/valedation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patients.actions"
import { FormFieldType } from "./PatientForm"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

const RegisterForm=({user}:{user:User})=> {
    const router =useRouter();
    const [isLoading,setIsLoading]=useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name:"",
      email:"",
      phone:"",
    },
  })

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
   setIsLoading(true);
   let formDate;
   if (values.identificationDocument && values.identificationDocument.length > 0) {
     const blobFile = new Blob([values.identificationDocument[0]], {
       type: values.identificationDocument[0].type,
     })
     formDate = new FormData();
     formDate.append('blobFile', blobFile);
     formDate.append('fileName',values.identificationDocument[0].name);
   }
   try{
    const patientData = {
      ...values,
      userId: user.$id,
      birthDate: new Date(values.birthDate),
      identificationDocument: formDate,
    }
    console.log(patientData)
    const patient = await registerPatient(patientData)
    console.log(patient)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if(patient) router.push(`/patients/${user.$id}/new-appointment`)
   }catch(error){
    console.log(error)
   }
  }
  return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">personal information</h2>
            </div>
        </section>
        <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name='name'
        label="Full name"
        placeholder = 'Mohammed Alshayb'
        iconSrc = "/assets/icons/user.svg"
        iconAlt ='user'
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='email'
          label = 'Email'
          placeholder = 'Mohammed@gmail.com'
          iconSrc = "/assets/icons/email.svg"
          iconAlt ='user'
          />
          <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name='phone'
          label = 'Phone number'
          placeholder = '+20 105 555 5555'
          iconSrc = "/assets/icons/user.svg"
          iconAlt ='user'
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name='birtDate'
          label = 'Date of birth'
          />
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name='gender'
          label = 'Gender'
          renderSkeleton={(field)=>(
            <FormControl>
              <RadioGroup className="flex h-11 gap-6 xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}>
                {GenderOptions.map((option)=>(
                  <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option}/>
                    <Label htmlFor={option}
                    className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
  )}/>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='address'
          label = 'address'
          placeholder = 'Egypt, Cairo'
          />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='occupation'
          label = 'Occupation'
          placeholder = 'Software Engineer'
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='emergencyContactName'
          label = 'Emergency contact name'
          placeholder = "Gurdian's name"
          />
          <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name='emergencyContactNumber'
          label = 'Emergency contact number'
          placeholder = '+20 105 555 5555'
          />
        </div>
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical information</h2>
            </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='primaryPhysician'
          label = 'Primary Physicion'
          placeholder = 'Select a physicion'
          >
            {Doctors.map((doctor)=>(
              <SelectItem key={doctor.name} value={doctor.name} className="w-full">
                <div className="flex cursor-pointer items-center w-full py-1">
                  <Image 
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border mx-2 border-dark-500"/>
                  <p className="w-full">{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='insuranceProvider'
          label = 'Insurance Provider'
          placeholder = 'RedCross'
          />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='insurancePolicyNumber'
          label = 'Insurance Policy Number'
          placeholder = 'XXXX123456789'
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name='allergies'
          label = 'Allergies'
          placeholder = 'allergies from cats, peanuts,polle'
          />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name='currentMedication'
          label = 'current medication (if any)'
          placeholder = 'Paracetamol 500mg ,Profen 500mg'
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name='familyMedicalHistory'
          label = 'family Medical History'
          placeholder = 'father had cancer and mom had diapets'
          />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name='pastMedicalHistory'
          label = 'past Medical History'
          placeholder = 'diapets'
          />
        </div>
  
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and verification</h2>
            </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name='identificationType'
          label = 'identification Type'
          placeholder = 'Select identification Type'
          >
            {IdentificationTypes.map((type)=>(
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='identificationNumber'
          label = 'identification Number'
          placeholder = 'Write your identification card number'
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name='identificationDocument'
          label = 'Img or PDF for your Identification Document'
          renderSkeleton={(field)=>(
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange}/>
            </FormControl>
  )}/>
  <section className="space-y-6">
            <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I Consent to Treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I Consent to disclosure information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I Consent to privacy policy"
        />
        
      <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm