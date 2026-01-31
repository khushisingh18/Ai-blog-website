import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Trophy, Award, TrendingUp, Users, FileText, Globe, Eye, Loader2 } from 'lucide-react';

const Community = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      const [leaderboardRes, badgesRes, statsRes] = await Promise.all([
        api.get('/community/leaderboard?limit=10'),
        api.get('/community/badges'),
        api.get('/community/stats'),
      ]);

      setLeaderboard(leaderboardRes.data.leaderboard);
      setBadges(badgesRes.data.badges);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-500" />
          Community
        </h1>

        {/* Platform Stats */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={<Users className="w-6 h-6 text-blue-500" />}
              label="Total Users"
              value={stats.totalUsers}
            />
            <StatCard
              icon={<FileText className="w-6 h-6 text-green-500" />}
              label="Total Blogs"
              value={stats.totalBlogs}
            />
            <StatCard
              icon={<Globe className="w-6 h-6 text-purple-500" />}
              label="Languages"
              value={stats.totalLanguages}
            />
            <StatCard
              icon={<Eye className="w-6 h-6 text-orange-500" />}
              label="Total Views"
              value={stats.totalViews?.toLocaleString()}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Top Contributors
            </h2>

            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-all"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Level {user.level} • {user.badges?.length || 0} badges
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{user.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Available Badges
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className="p-4 bg-muted rounded-lg text-center"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold mb-1">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default Community;
