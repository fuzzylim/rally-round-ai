import { createClient } from '@supabase/supabase-js';

export type Role = 'admin' | 'org_admin' | 'team_manager' | 'member' | 'anonymous';
export type Resource = 'fundraisers' | 'competitions' | 'teams' | 'members' | 'events';
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

interface AccessRule {
  roles: Role[];
  resources: Resource[];
  actions: Action[];
  condition?: (context: AccessContext) => boolean;
}

interface AccessContext {
  userId?: string;
  orgId?: string;
  teamId?: string;
  resourceOwnerId?: string;
  [key: string]: any;
}

// Zanzibar-style access rules
const accessRules: AccessRule[] = [
  // Admin can do everything
  {
    roles: ['admin'],
    resources: ['fundraisers', 'competitions', 'teams', 'members', 'events'],
    actions: ['create', 'read', 'update', 'delete', 'manage'],
  },
  // Organization admin can manage their organization
  {
    roles: ['org_admin'],
    resources: ['fundraisers', 'competitions', 'teams', 'members', 'events'],
    actions: ['create', 'read', 'update', 'delete', 'manage'],
    condition: (ctx) => !!ctx.orgId && ctx.userOrgs?.includes(ctx.orgId),
  },
  // Team manager can manage their team
  {
    roles: ['team_manager'],
    resources: ['teams', 'members'],
    actions: ['read', 'update', 'manage'],
    condition: (ctx) => !!ctx.teamId && ctx.userTeams?.includes(ctx.teamId),
  },
  {
    roles: ['team_manager'],
    resources: ['fundraisers', 'competitions', 'events'],
    actions: ['create', 'read', 'update'],
    condition: (ctx) => !!ctx.teamId && ctx.userTeams?.includes(ctx.teamId),
  },
  // Members can view and participate
  {
    roles: ['member'],
    resources: ['fundraisers', 'competitions', 'teams', 'events'],
    actions: ['read'],
  },
  // Resource owners can manage their own resources
  {
    roles: ['member'],
    resources: ['fundraisers', 'competitions', 'events'],
    actions: ['update', 'delete'],
    condition: (ctx) => ctx.resourceOwnerId === ctx.userId,
  },
  // Anonymous users can only read public data
  {
    roles: ['anonymous'],
    resources: ['fundraisers', 'competitions', 'events'],
    actions: ['read'],
    condition: (ctx) => ctx.isPublic === true,
  },
];

export async function getUserRoles(userId: string): Promise<Role[]> {
  if (!userId) return ['anonymous'];
  
  // In a real app, this would query Supabase for user roles
  // For now, we'll just return a mock implementation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  try {
    // Example query to get user roles from a roles table
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user roles:', error);
      return ['anonymous'];
    }
    
    return data?.map(r => r.role as Role) || ['member'];
  } catch (err) {
    console.error('Failed to get user roles:', err);
    return ['anonymous'];
  }
}

export async function checkAccess(
  userRoles: Role[],
  resource: Resource,
  action: Action,
  context: AccessContext = {}
): Promise<boolean> {
  // Check if any rule allows this action
  for (const rule of accessRules) {
    const roleMatch = rule.roles.some(role => userRoles.includes(role));
    const resourceMatch = rule.resources.includes(resource);
    const actionMatch = rule.actions.includes(action);
    
    if (roleMatch && resourceMatch && actionMatch) {
      // If there's a condition, evaluate it
      if (rule.condition) {
        if (rule.condition(context)) {
          return true;
        }
      } else {
        // No condition means automatic access
        return true;
      }
    }
  }
  
  return false;
}

export async function hasAccess(
  userId: string,
  resource: Resource,
  action: Action,
  context: AccessContext = {}
): Promise<boolean> {
  const userRoles = await getUserRoles(userId);
  return checkAccess(userRoles, resource, action, context);
}

export default {
  getUserRoles,
  checkAccess,
  hasAccess
};
