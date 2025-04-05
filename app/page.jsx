import HeroSection from "@/components/hero";
import { features } from "@/data/features";
import { Card ,CardHeader ,CardTitle , CardDescription , CardContent, CardFooter } from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { Accordion ,AccordionItem ,AccordionTrigger,AccordionContent } from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Arrow } from "@radix-ui/react-dropdown-menu";
import { ArrowRight } from "lucide-react";
export default function Home() {
  return (
    <div>
     <div></div>
     <HeroSection />

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3x1 font-bold tracking-tighter text-center mb-12">
            Various Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6x1 mx-auto"
          >{features.map((feature,index)=>{
            return(
              <Card key={index} className="border-2 hover:border-primary transition-colors duration-300">
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">
                      {feature.title}
                      </h3>
                    <p className="text-muted-forceground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}</div>
        </div>
      </section>
        


      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/100">
        <div className="container mx-auto px-4 md:px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
           <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">50+</h3>
            <p className="text-muted-foreground">Industries Covered</p>
           </div>

           <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">200+</h3>
            <p className="text-muted-foreground">Interview Questions</p>
           </div>

           <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="text-muted-foreground">AI Support</p>
           </div>

           <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold">100+</h3>
            <p className="text-muted-foreground">Courses</p>
           </div>
          </div>

          
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">

         <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions
         </h2>

         <p className="text-muted-foreground">Find answers to most common questions about our platform.

         </p>
         <div className="max-w-6xl mx-auto">

         <Accordion type="single" collapsible>
            
         

          {faqs.map((faq,index)=>{
              return(
              <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
               {faq.answer}
              </AccordionContent>
            </AccordionItem> );
          })}
           </Accordion>
         </div>

        </div>
          
        </div>
      </section>
        
        
      <section className="w-full bg-white">
        <div className="mx-auto py-24 gradient rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto"> 

         <h2 className="text-3x1 font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl text-black">Ready to Accelerate Your Career?
         </h2>

         <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">Join us and grow smartly with AI

         </p>
       <Link href="/dashboard" passHref>
       <Button
       size="lg"
       variant="secondary"
       className="h-11 mt-5 animate-bounce"
       >
        Start Your Journey Today <ArrowRight className="ml-2 h-4 w-4"/>

       </Button>
       </Link>

        </div>
          
        </div>
      </section>
        


    </div>
  );
}
