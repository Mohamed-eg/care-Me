import AppointmentForm from "@/components/forms/AppointmentForm";
import ModeToggle from "@/components/themeTagel";
import { getPatient } from "@/lib/actions/patients.actions";
import Image from "next/image";
export default async function NewAppointment({params:{userId}}:SearchParamProps) {
const patient =await getPatient(userId);
  return (
   <div className="flex h-screen max-h-screen">
    <ModeToggle/>
    <section className="remove-scrollbar container my-auto">
      <div className="sub-container max-w-[860px] flex-1 justify-between">
        <Image 
        src="/assets/icons/logo-full.svg"
        height={1000}
        width={1000}
        alt="patient"
        priority={false}
        className="mb-12 !h-14 w-fit mx-auto rounded-md"
        />
        <AppointmentForm
        type="create"
        userId={userId}
        patientId = {patient.$id}
        />
        

        <p  className="justify-items-end text-dark-600 xl:text-left ">
        © 2024 MedEasy
        </p>
      </div>
    </section>
    <Image
    src="/assets/images/appintment-img.png"
    height={1000}
    width={1000}
    alt="patient"
    className="side-img max-w-[390px] bg-bottom"
    ></Image>
   </div>
  );
}
