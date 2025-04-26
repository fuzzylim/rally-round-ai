'use client';

import { useState, useRef, useEffect } from 'react';
import { useOrganization, type Organization, type OrganizationInvitation } from './OrganizationProvider';
import Link from 'next/link';

export function OrganizationSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    activeOrganization,
    organizations,
    pendingInvitations,
    switchOrganization,
    acceptInvitation
  } = useOrganization();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle switch organization
  const handleSwitchOrg = (orgId: string) => {
    switchOrganization(orgId);
    setIsOpen(false);
  };
  
  // Get organization initials for avatar
  const getOrgInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (!activeOrganization) {
    return null;
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-md text-white text-xs font-medium">
          {activeOrganization.logoUrl ? (
            <img
              src={activeOrganization.logoUrl}
              alt={activeOrganization.name}
              className="w-full h-full rounded-md object-cover"
            />
          ) : (
            getOrgInitials(activeOrganization.name)
          )}
        </div>
        <span className="text-sm font-medium text-white truncate max-w-[120px]">
          {activeOrganization.name}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-md shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-slate-700">
            <p className="text-xs font-medium text-slate-400">Switch organization</p>
          </div>
          
          {/* Organizations list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {organizations.map(org => (
              <button
                key={org.id}
                onClick={() => handleSwitchOrg(org.id)}
                className={`w-full text-left px-3 py-2 flex items-center space-x-3 hover:bg-slate-800/70 transition-colors ${
                  activeOrganization.id === org.id ? 'bg-slate-800/70' : ''
                }`}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-md text-white text-xs font-medium">
                  {org.logoUrl ? (
                    <img
                      src={org.logoUrl}
                      alt={org.name}
                      className="w-full h-full rounded-md object-cover"
                    />
                  ) : (
                    getOrgInitials(org.name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{org.name}</p>
                  <p className="text-xs text-slate-400 truncate">{org.role}</p>
                </div>
                {activeOrganization.id === org.id && (
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* Pending invitations */}
          {pendingInvitations.length > 0 && (
            <>
              <div className="px-3 py-2 border-t border-b border-slate-700">
                <p className="text-xs font-medium text-slate-400">Pending invitations</p>
              </div>
              <div className="max-h-40 overflow-y-auto py-1">
                {pendingInvitations.map(invitation => (
                  <div key={invitation.id} className="px-3 py-2 hover:bg-slate-800/70">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-md text-white text-xs font-medium">
                        {getOrgInitials(invitation.organizationName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{invitation.organizationName}</p>
                        <p className="text-xs text-slate-400 truncate">
                          Invited by {invitation.invitedBy} • {invitation.role}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => acceptInvitation(invitation.id)}
                        className="flex-1 text-xs px-2 py-1 bg-blue-600/40 text-blue-200 rounded hover:bg-blue-600/60 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => acceptInvitation(invitation.id)}
                        className="flex-1 text-xs px-2 py-1 bg-slate-700/40 text-slate-300 rounded hover:bg-slate-700/60 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Create new organization option */}
          <div className="px-3 py-2 border-t border-slate-700">
            <Link
              href="/organizations/create"
              className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create new organization</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
