"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from "react";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from 'next/navigation';
import { Card,CardHeader,CardContent,CardDescription,CardFooter,CardTitle } from "@/components/ui/card";
import { Select,SelectTrigger,SelectValue,SelectItem,SelectContent } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { UpdateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
const OnboardingForm = ({industries}) => {
 const[selectedIndustry,setSelectedIndustry]=useState(null);
 const router = useRouter();

const {loading:updateLoading,
    fn: updateUserFn,
    data: updateResult,
} =  useFetch(UpdateUser);


    const{
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,

}=useForm({
    resolver: zodResolver(onboardingSchema),

 });
const onSubmit = async (values) => {
    try{
   const formattedIndustry = `${values.industry}-${values.subIndustry
    .toLowerCase()
    .replace(/ /g,"-")}`;
    
    await updateUserFn({
        ...values,
        industry: formattedIndustry,
    });

    }catch(error){
      console.error("onboarding error:",error)

    }
};

useEffect(()=>{
if(updateResult?.success && !updateLoading){
    toast.success("Profile completed succesfully");
    router.push("/dashboard");
    router.refresh();
}

},[updateResult,updateLoading]);

 const watchIndustry = watch("industry");
return(
 <div className="flex items-center justify-center bg-background">
<Card className="w-full max-w-lg mt-10 mx-2">
  <CardHeader>
    <CardTitle className="gradient-title text-4xl">Complete your profile</CardTitle>
    <CardDescription>Select your industry to get personalized career Insights
        and recommendations
    </CardDescription>
  </CardHeader>

  <CardContent>
    <form className="space-y-6 " onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
            <Label htmlFor="industry">
                  Industry
                  
            </Label>
      
    <Select
    onValueChange = {(value)=>{
        setValue("industry",value);
        setSelectedIndustry(
            industries.find((ind)=>ind.id === value)
        
        );
        setValue("subIndustry" , "");
    }}
    
    >
        <SelectTrigger id="industry"> 
            <SelectValue placeholder="Select an industry" />
        </SelectTrigger>
        <SelectContent>
            {industries.map((ind)=>{

                return <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
            })}
            
            
        </SelectContent>
    </Select>

      {
        errors.industry && (

            <p className="text-sm text-red-500">
                {errors.industry.message}
            </p>
        )
      }

    </div>





{watchIndustry && (
    <div className="space-y-2">
            <Label htmlFor="subindustry">
                  Specialization
                  
            </Label>
      
    <Select
    onValueChange = {(value)=>{
        setValue("subIndustry" , value);
    }}
    
    >
        <SelectTrigger id="subindustry"> 
            <SelectValue placeholder="Select specialization" />
        </SelectTrigger>
        <SelectContent>
            {selectedIndustry?.subIndustries.map((ind)=>{

                return <SelectItem value={ind} key={ind}>{ind}</SelectItem>
            })}
            
            
        </SelectContent>
    </Select>

      {
        errors.subIndustry && (
            <p className="text-sm text-red-500">
                {errors.subIndustry.message}
            </p>
        )
      }

    </div>
)
}



<div className="space-y-2">
            <Label htmlFor="experience">
                  Years of Experience
                  
            </Label>
      <Input
      id="experience"
      type = "number"
      min = "0"
      max = "50"
      placeholder = "Enter Years of Experience"
      {...register("experience")}
      
      />
   
      {
        errors.experience && (
            <p className="text-sm text-red-500">
                {errors.experience.message}
            </p>
        )
      }
    </div>



    <div className="space-y-2">
            <Label htmlFor="skills">
                 Skills
                  
            </Label>
      <Input
      id="skills"
      placeholder="eg Python , Java, C++"
      {...register("skills")}
      
      />
       <p className="text-sm text-muted-foreground"> 
         Separate multiple skills with commas
       </p>
      {
        errors.skills && (
            <p className="text-sm text-red-500">
                {errors.skills.message}
            </p>
        )
      }
    </div>



    <div className="space-y-2">
            <Label htmlFor="bio">
                 Professional Bio
                  
            </Label>
      <Textarea
      id="bio"
      placeholder="Tell about your background"
      className="h-32"
      {...register("bio")}
      
      />
      
      {
        errors.bio && (
            <p className="text-sm text-red-500">
                {errors.bio.message}
            </p>
        )
      }
    </div>
<Button type="submit" className="w-full" disabled={updateLoading}>
    
 {updateLoading?
 (
    <>
     <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
     Saving...

    </>
 ) :(
    "Complete Profile"
 )
}

</Button>
    </form>
  </CardContent>
 
</Card>
 </div>
);

}

export default OnboardingForm;