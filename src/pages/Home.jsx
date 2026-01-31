import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Globe, Trophy, Mic, Zap, Users, BookOpen, 
  TrendingUp, Check, Star, ArrowRight, Pen, Shield, Heart
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">AI-Powered Content Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Write Better, Faster
            <br />
            <span className="text-blue-200">with ScribeFlow</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
            The AI-powered blogging platform that helps you create, translate, and share your stories with the world. Join thousands of writers today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Start Writing <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/feed"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-all"
                >
                  Explore Feed
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>5,000+ active writers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="5,000+" label="Active Writers" />
            <StatCard number="50,000+" label="Blog Posts" />
            <StatCard number="12+" label="Languages" />
            <StatCard number="1M+" label="Monthly Readers" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Everything You Need to <span className="text-blue-600">Create Amazing Content</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Powerful features designed to make blogging easier, faster, and more engaging than ever before.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-blue-600" />}
              title="AI-Assisted Writing"
              description="Generate professional content from simple prompts using advanced AI technology"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-green-600" />}
              title="Instant Translation"
              description="Translate your blogs to 12+ languages instantly and reach a global audience"
            />
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-red-600" />}
              title="Text-to-Speech"
              description="Listen to any blog post with our multilingual text-to-speech feature"
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-yellow-600" />}
              title="Gamification"
              description="Earn points, unlock badges, and climb the leaderboard as you create"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-purple-600" />}
              title="Community"
              description="Connect with writers worldwide and build your audience"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="SEO Optimized"
              description="Auto-generated keywords and tags to boost your content's visibility"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Start Publishing in <span className="text-blue-600">3 Simple Steps</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16">
            From idea to published post in minutes
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Account"
              description="Sign up for free and join our community of writers. No credit card required."
              icon={<Pen className="w-12 h-12 text-blue-600" />}
            />
            <StepCard
              number="2"
              title="Write or Generate"
              description="Use our AI to generate content from prompts, or write your own masterpiece."
              icon={<Sparkles className="w-12 h-12 text-blue-600" />}
            />
            <StepCard
              number="3"
              title="Publish & Share"
              description="Share your story with the world and start earning points and badges."
              icon={<TrendingUp className="w-12 h-12 text-blue-600" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Loved by <span className="text-blue-600">Writers Worldwide</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16">
            See what our community has to say
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ScribeFlow's AI feature helped me overcome writer's block. I've published 10 posts in the last month!"
              author="Sarah Johnson"
              role="Travel Blogger"
              rating={5}
            />
            <TestimonialCard
              quote="The translation feature is a game-changer. My blog now reaches readers in 8 different countries."
              author="Carlos Rodriguez"
              role="Tech Writer"
              rating={5}
            />
            <TestimonialCard
              quote="The gamification keeps me motivated. I love earning badges and seeing my progress on the leaderboard!"
              author="Priya Patel"
              role="Lifestyle Blogger"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Writing Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of writers creating amazing content with ScribeFlow today
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg"
              >
                Start Writing for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/feed"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                Explore Blog Posts <BookOpen className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all card-hover">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description, icon }) => {
  return (
    <div className="relative p-8 bg-background rounded-xl border border-border hover:shadow-lg transition-all">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role, rating }) => {
  return (
    <div className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-muted-foreground mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div className="font-semibold">{author}</div>
      <div className="text-sm text-muted-foreground">{role}</div>
    </div>
  );
};

export default Home;
