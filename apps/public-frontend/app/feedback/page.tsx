import { Button } from '@rallyround/ui';

export const metadata = {
  title: 'Feedback | RallyRound',
  description: 'Share your thoughts and help us improve',
};

export default function FeedbackPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">We'd Love Your Feedback</h1>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
            Help us build a better platform for social clubs and healthy competitions. What sports, activities, or features would you like to see?
          </p>
        </div>
        
        <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl p-8 max-w-3xl mx-auto">
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            {/* Feedback Type */}
            <div>
              <label htmlFor="feedback-type" className="block text-sm font-medium text-white">What would you like to share feedback about?</label>
              <select
                id="feedback-type"
                className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              >
                <option value="">Select a category</option>
                <option value="competitions">Competitions & Sports</option>
                <option value="events">Club Events & Activities</option>
                <option value="features">App Features</option>
                <option value="usability">User Experience</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Sports Interest */}
            <div>
              <label className="block text-sm font-medium text-white">What sports or activities interest you?</label>
              <p className="text-xs text-slate-400 mt-1 mb-2">Select all that apply</p>
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-2">
                <div className="flex items-start">
                  <input
                    id="golf"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="golf" className="ml-2 block text-sm text-slate-300">Golf</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="tennis"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="tennis" className="ml-2 block text-sm text-slate-300">Tennis</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="cricket"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="cricket" className="ml-2 block text-sm text-slate-300">Cricket</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="football"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="football" className="ml-2 block text-sm text-slate-300">Football</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="swimming"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="swimming" className="ml-2 block text-sm text-slate-300">Swimming</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="cycling"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="cycling" className="ml-2 block text-sm text-slate-300">Cycling</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="running"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="running" className="ml-2 block text-sm text-slate-300">Running</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="basketball"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="basketball" className="ml-2 block text-sm text-slate-300">Basketball</label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="lawn-bowls"
                    name="sports"
                    type="checkbox"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 rounded mt-1"
                  />
                  <label htmlFor="lawn-bowls" className="ml-2 block text-sm text-slate-300">Lawn Bowls</label>
                </div>
              </div>
            </div>
            
            {/* Other Sport Input */}
            <div>
              <label htmlFor="other-sport" className="block text-sm font-medium text-white">Any other sports or activities?</label>
              <input
                type="text"
                id="other-sport"
                className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                placeholder="E.g., Surfing, Yoga, Darts, etc."
              />
            </div>
            
            {/* Open Feedback */}
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-white">Your Feedback</label>
              <p className="text-xs text-slate-400 mt-1 mb-2">Tell us what you'd like to see on the platform</p>
              <textarea
                id="feedback"
                rows={5}
                className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                placeholder="Share your thoughts, suggestions, and ideas..."
              ></textarea>
            </div>
            
            {/* Format Preference */}
            <div>
              <label className="block text-sm font-medium text-white">How do you prefer to compete?</label>
              <p className="text-xs text-slate-400 mt-1 mb-2">This helps us design the right format for competitions</p>
              
              <div className="mt-2 space-y-3">
                <div className="flex items-start">
                  <input
                    id="casual"
                    name="format"
                    type="radio"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 mt-1"
                  />
                  <label htmlFor="casual" className="ml-2 block">
                    <span className="text-sm font-medium text-slate-300">Casual, social competitions</span>
                    <span className="block text-xs text-slate-400">Fun-focused with minimal pressure</span>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="structured"
                    name="format"
                    type="radio"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 mt-1"
                  />
                  <label htmlFor="structured" className="ml-2 block">
                    <span className="text-sm font-medium text-slate-300">Structured, regular competitions</span>
                    <span className="block text-xs text-slate-400">Organized leagues or tournaments</span>
                  </label>
                </div>
                
                <div className="flex items-start">
                  <input
                    id="competitive"
                    name="format"
                    type="radio"
                    className="h-4 w-4 bg-slate-900/50 border-slate-600 text-blue-500 focus:ring-blue-500 mt-1"
                  />
                  <label htmlFor="competitive" className="ml-2 block">
                    <span className="text-sm font-medium text-slate-300">Competitive events</span>
                    <span className="block text-xs text-slate-400">More serious with rankings and prizes</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3">
                Submit Feedback
              </Button>
              <p className="text-xs text-slate-400 text-center mt-3">
                Thanks for helping us improve! We read every submission.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
