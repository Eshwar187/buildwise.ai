"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HomeHeader } from "@/components/home-header"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react"
import { toast } from "sonner"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, you would send this data to your API
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setIsSuccess(true)
      form.reset()
      toast.success("Your message has been sent successfully!")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/blueprint-bg.jpg"
            alt="Blueprint background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Have questions about our services or need help with your project? We're here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-slate-800/50 p-8 rounded-xl border border-slate-700"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>

              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-300 mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                {...field}
                                className="bg-slate-700 border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your email"
                                type="email"
                                {...field}
                                className="bg-slate-700 border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your phone number"
                                {...field}
                                className="bg-slate-700 border-slate-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-slate-700 border-slate-600">
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message"
                              {...field}
                              className="bg-slate-700 border-slate-600 min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-pulse">Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Our Office</h3>
                      <p className="text-slate-300">
                        123 Innovation Drive<br />
                        San Francisco, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Phone</h3>
                      <p className="text-slate-300">
                        <a href="tel:+14155552671" className="hover:text-cyan-400 transition-colors">
                          +1 (415) 555-2671
                        </a>
                      </p>
                      <p className="text-slate-400 text-sm">
                        Monday to Friday, 9am to 6pm PST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Email</h3>
                      <p className="text-slate-300">
                        <a href="mailto:info@buildwise.ai" className="hover:text-cyan-400 transition-colors">
                          info@buildwise.ai
                        </a>
                      </p>
                      <p className="text-slate-300">
                        <a href="mailto:support@buildwise.ai" className="hover:text-cyan-400 transition-colors">
                          support@buildwise.ai
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-slate-700 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Business Hours</h3>
                      <p className="text-slate-300">
                        Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                        Saturday: 10:00 AM - 4:00 PM PST<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Follow Us</h2>
                <div className="flex space-x-4">
                  <Link href="#" className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 transition-colors">
                    <Linkedin className="h-6 w-6 text-cyan-400" />
                  </Link>
                  <Link href="#" className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 transition-colors">
                    <Twitter className="h-6 w-6 text-cyan-400" />
                  </Link>
                  <Link href="#" className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 transition-colors">
                    <Facebook className="h-6 w-6 text-cyan-400" />
                  </Link>
                  <Link href="#" className="bg-slate-700 p-3 rounded-full hover:bg-slate-600 transition-colors">
                    <Instagram className="h-6 w-6 text-cyan-400" />
                  </Link>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-medium text-white mb-4">Need Immediate Assistance?</h3>
                <p className="text-slate-300 mb-4">
                  Our customer support team is available to help you with any questions or issues.
                </p>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white">
                  <Phone className="mr-2 h-4 w-4" /> Schedule a Call
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-xl overflow-hidden h-[400px] relative"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0968870204795!2d-122.41941492392031!3d37.77492997197701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter%20HQ!5e0!3m2!1sen!2sus!4v1682532223525!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300">
              Find answers to common questions about our services and platform.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="space-y-6"
            >
              {[
                {
                  question: "How quickly can I get a floor plan?",
                  answer: "Our AI-powered platform can generate initial floor plans in minutes. For more complex projects with specific requirements, it may take a few hours to refine and optimize the design."
                },
                {
                  question: "Can I customize the floor plans?",
                  answer: "Absolutely! Our platform allows for extensive customization. You can adjust room sizes, layouts, add or remove features, and make other changes to ensure the floor plan meets your specific needs."
                },
                {
                  question: "Do you provide material recommendations?",
                  answer: "Yes, we provide detailed material recommendations based on your budget, location, and sustainability preferences. Our system analyzes local availability and cost to give you the most practical options."
                },
                {
                  question: "How do I connect with local designers?",
                  answer: "Once you've generated a floor plan, our platform automatically matches you with qualified local designers who can help bring your vision to life. You can view their profiles, portfolios, and contact them directly through our platform."
                },
                {
                  question: "What if I'm not satisfied with my floor plan?",
                  answer: "We offer unlimited revisions on our premium plans. If you're not happy with your initial design, you can provide feedback and our AI will generate new options based on your input. Our goal is your complete satisfaction."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-slate-700/50 p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/30 to-teal-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
              Ready to Transform Your Ideas into Reality?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your journey with BuildWise.ai today and see how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-950"
              >
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                BuildWise.ai
              </h2>
              <p className="text-slate-400 mt-2">Building the future with AI</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-white font-medium mb-2">Platform</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Company</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Legal</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-center text-slate-500">
            <p>© {new Date().getFullYear()} BuildWise.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
