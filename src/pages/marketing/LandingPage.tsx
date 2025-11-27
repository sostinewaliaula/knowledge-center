import React from 'react';
import { ArrowRight, Award, BookOpen, CheckCircle2, Clock, GraduationCap, Play, Shield, Sparkles, Star, Target, TrendingUp, Users, Zap } from 'lucide-react';

type Page = 'landing' | 'learner' | 'learning' | 'reports';

interface LandingPageProps {
  onNavigate?: (page: Page) => void;
}

const features = [{
  title: 'Employee Development',
  description: 'Comprehensive training programs for all employees—from onboarding to advanced skill development and career growth.',
  icon: <Users className="text-purple-600" size={20} />
}, {
  title: 'Real-Time Progress',
  description: 'Advanced dashboards help managers and HR track employee progress, completion rates, and skill development in real-time.',
  icon: <TrendingUp className="text-green-600" size={20} />
}, {
  title: 'Compliance & Certification',
  description: 'Built-in assessments, quizzes, and assignments ensure compliance, validate skills, and maintain certification records.',
  icon: <Shield className="text-purple-600" size={20} />
}, {
  title: 'Personalized Learning Paths',
  description: 'AI-powered recommendations create customized learning journeys based on role, department, and career goals.',
  icon: <Sparkles className="text-green-600" size={20} />
}, {
  title: 'Interactive Content',
  description: 'Engaging multimedia courses, interactive modules, and hands-on exercises keep employees motivated and learning.',
  icon: <BookOpen className="text-purple-600" size={20} />
}, {
  title: 'Performance Analytics',
  description: 'Detailed reports and analytics help identify skill gaps, measure ROI, and optimize training programs.',
  icon: <Target className="text-green-600" size={20} />
}];

const stats = [{
  label: 'Active employees',
  value: '500+'
}, {
  label: 'Training courses',
  value: '120+'
}, {
  label: 'Completion rate',
  value: '94%'
}, {
  label: 'Certifications issued',
  value: '1,200+'
}];

const trainingCategories = [{
  title: 'Onboarding & Orientation',
  description: 'Get new employees up to speed quickly with structured onboarding programs.',
  courses: 15,
  icon: <Zap className="text-purple-600" size={24} />
}, {
  title: 'Technical Skills',
  description: 'Advance technical capabilities with hands-on training and certification programs.',
  courses: 32,
  icon: <GraduationCap className="text-green-600" size={24} />
}, {
  title: 'Leadership Development',
  description: 'Build strong leaders with management and leadership training modules.',
  courses: 18,
  icon: <Award className="text-purple-600" size={24} />
}, {
  title: 'Compliance & Safety',
  description: 'Ensure workplace safety and regulatory compliance with mandatory training courses.',
  courses: 25,
  icon: <Shield className="text-green-600" size={24} />
}, {
  title: 'Soft Skills',
  description: 'Enhance communication, teamwork, and professional development skills.',
  courses: 20,
  icon: <Users className="text-purple-600" size={24} />
}, {
  title: 'Product Knowledge',
  description: 'Deep dive into company products, services, and industry knowledge.',
  courses: 12,
  icon: <BookOpen className="text-green-600" size={24} />
}];

const benefits = [{
  title: 'Faster Onboarding',
  description: 'Reduce time-to-productivity by 40% with streamlined onboarding processes.',
  metric: '40% faster'
}, {
  title: 'Higher Engagement',
  description: 'Interactive content and gamification keep employees engaged and motivated.',
  metric: '2.5x engagement'
}, {
  title: 'Better Retention',
  description: 'Continuous learning opportunities improve employee satisfaction and retention.',
  metric: '35% better'
}, {
  title: 'Cost Savings',
  description: 'Reduce training costs while improving outcomes compared to traditional methods.',
  metric: '60% savings'
}];

const howItWorks = [{
  step: '1',
  title: 'Access Your Dashboard',
  description: 'Log in to your personalized dashboard to see assigned courses, progress, and recommendations.'
}, {
  step: '2',
  title: 'Start Learning',
  description: 'Browse courses, enroll in training programs, and track your progress in real-time.'
}, {
  step: '3',
  title: 'Complete Assessments',
  description: 'Take quizzes, complete assignments, and earn certifications as you progress.'
}, {
  step: '4',
  title: 'Track Your Growth',
  description: 'Monitor your achievements, badges, and career development milestones.'
}];

export function LandingPage({
  onNavigate
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-green-50/30 to-white text-gray-900">
      <header className="sticky top-0 z-50 px-8 lg:px-16 py-1.5 flex flex-wrap items-center justify-between gap-2 bg-white/80 backdrop-blur-sm border-b border-purple-100/50">
        <div className="flex items-center gap-2">
          <img src="/assets/CcT2K1dC8NCSuB6a.png" alt="Knowledge Center Logo" className="w-16 h-16 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%239433ff"/><text x="32" y="42" font-size="24" fill="white" text-anchor="middle" font-weight="bold">KC</text></svg>'; }} />
          <div>
            <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">Knowledge Center</div>
            <div className="text-[10px] text-gray-500 leading-tight">TQ Academy</div>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <button className="font-semibold text-gray-900">Home</button>
          <button className="hover:text-purple-600 transition-colors" onClick={() => onNavigate?.('learner')}>
            My Dashboard
          </button>
          <button className="hover:text-green-600 transition-colors" onClick={() => onNavigate?.('learning')}>
            My Learning
          </button>
          <button className="hover:text-purple-600 transition-colors" onClick={() => onNavigate?.('reports')}>
            Admin Portal
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <button className="text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors">
            Log in
          </button>
          <button onClick={() => onNavigate?.('learner')} className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-green-600 text-white text-sm font-semibold hover:from-purple-700 hover:to-green-700 transition-all shadow-lg shadow-purple-500/30">
            Access Knowledge Center
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <main className="px-8 lg:px-16 py-16 space-y-24">
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-green-100 border border-purple-200/50 text-xs font-semibold text-purple-700">
              <Sparkles size={14} />
              Built for Caava Group Employees
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">Your modern corporate learning platform.</span> Better than Litmos.
              </h1>
              <p className="text-lg text-gray-600">
                Knowledge Center by TQ Academy delivers comprehensive training for all Caava Group employees with intuitive dashboards, real-time progress tracking, and detailed reporting—all in one powerful, modern platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate?.('learner')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-green-600 text-white font-semibold hover:from-purple-700 hover:to-green-700 transition-all shadow-lg shadow-purple-500/30">
                Access Knowledge Center
                <ArrowRight size={18} />
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-purple-200 text-purple-700 font-semibold hover:bg-purple-50 transition-colors" onClick={() => onNavigate?.('learning')}>
                <Play size={18} />
                View Training Catalog
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              {stats.map(stat => <div key={stat.label} className="p-4 rounded-2xl bg-gradient-to-br from-white to-purple-50/50 border border-purple-100">
                  <div className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
                </div>)}
            </div>
          </div>
          <div className="bg-white border-2 border-purple-100 rounded-[32px] shadow-[0_30px_60px_rgba(139,92,246,0.15)] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-purple-600 font-semibold">
                  Platform Preview
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  Employee Dashboard
                </div>
              </div>
              <button onClick={() => onNavigate?.('learner')} className="text-sm font-semibold text-purple-600 hover:text-green-600 transition-colors">
                View live →
              </button>
            </div>
            <div className="h-64 rounded-2xl bg-gradient-to-br from-purple-100 via-green-50 to-white flex items-center justify-center text-gray-400 text-sm border border-purple-100">
              Preview of Knowledge Center
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="rounded-2xl border border-purple-100 p-3 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                  6/30
                </div>
                <div className="text-gray-500 text-xs">Daily Goal</div>
              </div>
              <div className="rounded-2xl border border-green-100 p-3 bg-gradient-to-br from-green-50 to-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                  32
                </div>
                <div className="text-gray-500 text-xs">Badges</div>
              </div>
              <div className="rounded-2xl border border-purple-100 p-3 bg-gradient-to-br from-purple-50 to-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                  92%
                </div>
                <div className="text-gray-500 text-xs">Completion</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-white via-purple-50/30 to-green-50/30 rounded-[32px] border-2 border-purple-100 shadow-[0_30px_60px_rgba(139,92,246,0.08)] p-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-purple-600 font-semibold">
                Why Knowledge Center
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mt-2">
                The Litmos replacement built for <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">Caava Group</span>.
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 border-b-2 border-purple-600 hover:text-green-600 hover:border-green-600 transition-colors self-start">
              Contact HR
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => <div key={feature.title} className={`rounded-2xl border-2 p-5 transition-all hover:shadow-lg ${index % 2 === 0 ? 'border-purple-100 bg-gradient-to-br from-purple-50 to-white' : 'border-green-100 bg-gradient-to-br from-green-50 to-white'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${index % 2 === 0 ? 'bg-purple-100' : 'bg-green-100'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase tracking-wide text-purple-600 font-semibold">
              Training Categories
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Comprehensive Learning Programs for Every Employee
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From onboarding to advanced certifications, Knowledge Center offers training programs across all departments and skill levels.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingCategories.map((category, index) => <div key={category.title} className={`rounded-2xl border-2 p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${index % 2 === 0 ? 'border-purple-100 bg-gradient-to-br from-purple-50 to-white' : 'border-green-100 bg-gradient-to-br from-green-50 to-white'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${index % 2 === 0 ? 'bg-purple-100' : 'bg-green-100'}`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700 font-semibold">
                    {category.courses} Courses
                  </span>
                </div>
              </div>)}
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-600 to-green-600 rounded-[32px] p-12 text-white space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase tracking-wide text-purple-100 font-semibold">
              Key Benefits
            </div>
            <h2 className="text-3xl font-semibold">
              Why Caava Group Employees Love Knowledge Center
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => <div key={benefit.title} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="text-3xl font-bold mb-2">
                  {benefit.metric}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-purple-50">
                  {benefit.description}
                </p>
              </div>)}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase tracking-wide text-green-600 font-semibold">
              How It Works
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Get Started in Minutes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Knowledge Center makes employee training simple, engaging, and effective. Here's how to get started.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => <div key={step.step} className="relative">
                <div className={`rounded-2xl border-2 p-6 ${index % 2 === 0 ? 'border-purple-100 bg-gradient-to-br from-purple-50 to-white' : 'border-green-100 bg-gradient-to-br from-green-50 to-white'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4 ${index % 2 === 0 ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-300 to-green-300" />}
              </div>)}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              Trusted by Caava Group Employees
            </div>
            <p className="text-2xl font-semibold text-gray-900 leading-snug">
              “Knowledge Center streamlined our employee training and made tracking progress effortless. It's everything we needed from Litmos, but better—more intuitive, faster, and designed specifically for our team.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-green-200" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  HR & Learning Team
                </div>
                <div className="text-xs text-gray-500">
                  Caava Group
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-[28px] border-2 border-purple-100 shadow-[0_20px_40px_rgba(139,92,246,0.08)] p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Star className="text-amber-400 fill-amber-400" size={16} />
              <span className="font-semibold">Rated 4.8/5 by employees</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl border border-purple-100 p-3 bg-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                  94%
                </div>
                <div className="text-gray-500 text-xs">Completion rate</div>
              </div>
              <div className="rounded-2xl border border-green-100 p-3 bg-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                  40%
                </div>
                <div className="text-gray-500 text-xs">Faster onboarding</div>
              </div>
              <div className="rounded-2xl border border-purple-100 p-3 bg-white">
                <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                  2.5x
                </div>
                <div className="text-gray-500 text-xs">Better engagement</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-8 lg:px-16 py-10 border-t-2 border-purple-100 bg-gradient-to-b from-white to-purple-50/30 text-sm text-gray-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/assets/CcT2K1dC8NCSuB6a.png" alt="Knowledge Center Logo" className="w-8 h-8 object-contain" />
            <div>
              <div className="text-xs font-semibold text-gray-900">© {new Date().getFullYear()} Caava Group</div>
              <div className="text-xs">Knowledge Center (TQ Academy). All rights reserved.</div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="hover:text-purple-600 transition-colors">Privacy</button>
            <button className="hover:text-green-600 transition-colors">Terms</button>
            <button className="hover:text-purple-600 transition-colors">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

