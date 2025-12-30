import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Building2, LogOut, User, Users, Wrench, FileText, TrendingUp, ClipboardList, ShieldCheck, Building, BarChart3, ExternalLink, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const iconMap = {
  'Wrench': Wrench,
  'FileText': FileText,
  'User': User,
  'TrendingUp': TrendingUp,
  'ClipboardList': ClipboardList,
  'ShieldCheck': ShieldCheck,
  'Building2': Building,
  'BarChart3': BarChart3
};

const moduleImages = {
  'Tool Management': 'https://images.unsplash.com/photo-1556743769-8d7477994b25?w=400&h=300&fit=crop',
  'Assignment Letters': 'https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?w=400&h=300&fit=crop',
  'Health, Safety & Environment': 'https://images.unsplash.com/photo-1593812725955-6d89f01ded2d?w=400&h=300&fit=crop',
  'KPI Dashboard': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'Curriculum Vitae': 'https://images.unsplash.com/photo-1642522029695-2d4d222e41f5?w=400&h=300&fit=crop',
  'Vendor Data': 'https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?w=400&h=300&fit=crop'
};

const DashboardPage = () => {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(response.data);
    } catch (error) {
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleModuleClick = (module) => {
    if (module.external_url) {
      window.open(module.external_url, '_blank');
    } else if (!module.is_active) {
      toast.info(`${module.name} is currently in development`);
    } else {
      navigate(module.path);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-sm" style={{ backgroundColor: '#25476C' }}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Chivo, sans-serif', color: '#25476C' }}>
                  BKI Dashboard
                </h1>
                <p className="text-sm" style={{ color: '#64748B' }}>Balikpapan Commercial</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {(user?.role === 'SuperAdmin' || user?.role === 'Admin') && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/employees')}
                  className="rounded-sm border-slate-200"
                  data-testid="manage-employees-button"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Employees
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-sm" data-testid="user-menu-button">
                    <Avatar className="h-10 w-10 rounded-sm">
                      <AvatarFallback className="rounded-sm" style={{ backgroundColor: '#25476C', color: 'white' }}>
                        {getInitials(user?.full_name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-sm">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.full_name}</p>
                      <p className="text-xs text-slate-500">{user?.employee_id}</p>
                      <p className="text-xs font-medium" style={{ color: '#25476C' }}>{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="profile-menu-item">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="logout-menu-item">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
            Welcome back, {user?.full_name?.split(' ')[0]}
          </h2>
          <p className="text-base" style={{ color: '#64748B' }}>
            Access your applications and manage your work
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-sm p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="modules-grid">
            {modules.map((module, index) => {
              const IconComponent = iconMap[module.icon] || Building2;
              return (
                <div
                  key={index}
                  onClick={() => handleModuleClick(module)}
                  className="module-card bg-white border border-slate-200 rounded-sm p-6 hover:border-[#25476C]/30 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
                  data-testid={`module-card-${module.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {moduleImages[module.name] && (
                    <img
                      src={moduleImages[module.name]}
                      alt={module.name}
                      className="module-card-image"
                    />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-sm" style={{ backgroundColor: '#F1F5F9' }}>
                        <IconComponent className="w-6 h-6" style={{ color: '#25476C' }} />
                      </div>
                      {module.external_url && (
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#25476C] transition-colors" />
                      )}
                      {!module.is_active && !module.external_url && (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
                      {module.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      {module.description}
                    </p>

                    {!module.is_active && !module.external_url && (
                      <div className="mt-3">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          In Development
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;