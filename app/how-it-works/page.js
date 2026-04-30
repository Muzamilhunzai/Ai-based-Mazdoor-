import Header from '@/components/Header';
import { Search, Users, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Search',
      titleUrdu: 'تلاش کریں',
      desc: 'Use AI-powered search or browse categories to find the right worker.',
    },
    {
      icon: Users,
      title: 'Connect',
      titleUrdu: 'رابطہ کریں',
      desc: 'Chat with workers, negotiate price, and schedule the job.',
    },
    {
      icon: CheckCircle,
      title: 'Complete & Review',
      titleUrdu: 'مکمل کریں اور جائزہ دیں',
      desc: 'Track job progress, pay safely, and leave a review.',
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900">
      <Header />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold dark:text-white mb-2">How It Works</h1>
          <p className="font-urdu text-2xl text-primary">یہ کیسے کام کرتا ہے</p>
        </div>
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-white">{step.title}</h2>
                <p className="font-urdu text-lg text-primary mb-3">{step.titleUrdu}</p>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}