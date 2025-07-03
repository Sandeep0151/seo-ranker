'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, CheckCircle, Mail, Phone, User, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

const [fullReport, setFullReport] = useState<string | null>(null);

const handleDownloadPDF = async () => {
  const element = document.getElementById('report-section');
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('seo-report.pdf');
};

const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  setFullReport(null); // Clear previous result

  try {
    const response = await fetch('https://seoreport-backend.onrender.com/api/submit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const result = await response.json();

    setFullReport(result.full_report); // Set the full report
    toast({
      title: 'Success!',
      description: 'Report generated successfully!',
    });

    setIsSubmitted(true);
    reset();

    setTimeout(() => setIsSubmitted(false), 3000);
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to generate report. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section id="contact-form" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50 mt-8 sm:mt-12 lg:mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Ready to Get{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Started?
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-xs sm:max-w-2xl mx-auto px-4">
              Fill out the form below and our team will get back to you within 24 hours 
              to discuss your project and provide a custom solution.
            </p>
          </div>

          {/* Form Card */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl mx-4 sm:mx-0">
            <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Let's Work Together
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600">
                Tell us about your project and we'll help bring your vision to life
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your full name"
                      className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm sm:text-base"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter your phone number"
                      className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm sm:text-base"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email address"
                    className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm sm:text-base"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Website Field */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website URL <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="website"
                    {...register('website')}
                    placeholder="https://yourwebsite.com"
                    className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm sm:text-base"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : isSubmitted ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Message Sent!
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {fullReport && (
  <div id="report-section" className="mt-8 bg-white rounded-lg shadow p-6 text-base leading-relaxed prose max-w-none">
    <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 AI SEO & Business Report</h3>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {fullReport}
</ReactMarkdown>
    
    <div className="flex gap-4 mt-6">
      <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
        📄 Download PDF
      </Button>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(fullReport || '');
          toast({
            title: 'Copied!',
            description: 'Report copied to clipboard.',
          });
        }}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        📋 Copy Report
      </Button>
    </div>
  </div>
)}


          {/* Contact Info */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center px-4">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Or reach out to us directly
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a href="mailto:hello@digitalpro.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <Mail className="w-4 h-4" />
                hello@digitalpro.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">
                <Phone className="w-4 h-4" />
                (123) 456-7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}