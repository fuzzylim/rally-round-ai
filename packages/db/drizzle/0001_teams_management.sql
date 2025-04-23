-- Create team_role enum type
CREATE TYPE "team_role" AS ENUM ('owner', 'admin', 'coach', 'manager', 'member');

-- Create invitation_status enum type
CREATE TYPE "invitation_status" AS ENUM ('pending', 'accepted', 'declined', 'expired');

-- Create organization_teams table
CREATE TABLE IF NOT EXISTS "organization_teams" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "sport" text NOT NULL,
  "age_group" text NOT NULL,
  "logo_url" text,
  "created_by" uuid REFERENCES auth.users(id),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  "metadata" jsonb DEFAULT '{}'
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS "team_members" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" team_role DEFAULT 'member' NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization_teams"("id") ON DELETE CASCADE,
  CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE CASCADE,
  CONSTRAINT "team_members_team_id_user_id_key" UNIQUE ("team_id", "user_id")
);

-- Create team_invitations table
CREATE TABLE IF NOT EXISTS "team_invitations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" uuid NOT NULL,
  "email" text NOT NULL,
  "role" team_role DEFAULT 'member' NOT NULL,
  "token" uuid DEFAULT gen_random_uuid() NOT NULL,
  "invited_by_id" uuid NOT NULL,
  "invited_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "accepted_at" timestamp with time zone,
  "status" invitation_status DEFAULT 'pending' NOT NULL,
  "message" text,
  CONSTRAINT "team_invitations_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization_teams"("id") ON DELETE CASCADE,
  CONSTRAINT "team_invitations_invited_by_id_fkey" FOREIGN KEY ("invited_by_id") REFERENCES auth.users("id") ON DELETE SET NULL
);

-- Create team_activities table
CREATE TABLE IF NOT EXISTS "team_activities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" uuid NOT NULL,
  "user_id" uuid,
  "activity_type" text NOT NULL,
  "description" text NOT NULL,
  "metadata" jsonb DEFAULT '{}',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "team_activities_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization_teams"("id") ON DELETE CASCADE,
  CONSTRAINT "team_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES auth.users("id") ON DELETE SET NULL
);

-- Add RLS policies for organization_teams
ALTER TABLE "organization_teams" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teams they are members of"
  ON "organization_teams"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = organization_teams.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can update teams"
  ON "organization_teams"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = organization_teams.id
      AND team_members.user_id = auth.uid()
      AND (team_members.role = 'owner' OR team_members.role = 'admin')
    )
  );

CREATE POLICY "Authenticated users can create teams"
  ON "organization_teams"
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only team owners can delete teams"
  ON "organization_teams"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = organization_teams.id
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'owner'
    )
  );

-- Add RLS policies for team_members
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members of teams they belong to"
  ON "team_members"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members as tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and admins can manage team members"
  ON "team_members"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members as tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND (tm.role = 'owner' OR tm.role = 'admin')
    )
  );

-- Add RLS policies for team_invitations
ALTER TABLE "team_invitations" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team owners and admins can view and manage invitations"
  ON "team_invitations"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_invitations.team_id
      AND team_members.user_id = auth.uid()
      AND (team_members.role = 'owner' OR team_members.role = 'admin')
    )
  );

CREATE POLICY "Users can view and accept their own invitations"
  ON "team_invitations"
  FOR SELECT
  USING (
    team_invitations.email = (
      SELECT email FROM auth.users
      WHERE auth.users.id = auth.uid()
    )
  );

-- Add RLS policies for team_activities
ALTER TABLE "team_activities" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities of teams they belong to"
  ON "team_activities"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = team_activities.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX "idx_team_members_team_id" ON "team_members" ("team_id");
CREATE INDEX "idx_team_members_user_id" ON "team_members" ("user_id");
CREATE INDEX "idx_team_invitations_team_id" ON "team_invitations" ("team_id");
CREATE INDEX "idx_team_invitations_email" ON "team_invitations" ("email");
CREATE INDEX "idx_team_invitations_token" ON "team_invitations" ("token");
CREATE INDEX "idx_team_activities_team_id" ON "team_activities" ("team_id");
CREATE INDEX "idx_team_activities_user_id" ON "team_activities" ("user_id");
CREATE INDEX "idx_team_activities_created_at" ON "team_activities" ("created_at");
