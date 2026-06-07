import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserPlus, Shield, User as UserIcon } from "lucide-react";
import "./Team.css";

const Team = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");

  // Fetch Teams
  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/teams/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data;
    }
  });

  const activeTeam = teams[0]; // For demo, we just use the first team

  // Create Team Mutation
  const createTeamMutation = useMutation({
    mutationFn: (name) => axios.post(`http://${window.location.hostname}:5000/api/teams`, { name }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] })
  });

  // Add Member Mutation
  const addMemberMutation = useMutation({
    mutationFn: (email) => axios.post(`http://${window.location.hostname}:5000/api/teams/${activeTeam._id}/members`, { email }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setEmail("");
    }
  });

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    createTeamMutation.mutate(teamName);
    setTeamName("");
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!email.trim() || !activeTeam) return;
    addMemberMutation.mutate(email);
  };

  return (
    <div className="team-page fade-in">
      <header className="page-header">
        <h1>Team Management</h1>
        <p>Manage your workspace members and roles.</p>
      </header>

      {!activeTeam ? (
        <div className="empty-team-state card">
          <h2>You don't have a team yet</h2>
          <p>Create a team to start collaborating with others.</p>
          <form onSubmit={handleCreateTeam} className="create-team-form">
            <input 
              type="text" 
              placeholder="Team Name (e.g. Engineering)" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button type="submit" className="primary-btn">Create Team</button>
          </form>
        </div>
      ) : (
        <div className="team-grid">
          <div className="members-section card">
            <div className="section-title">
              <h2>{activeTeam.name} Members</h2>
              <span className="badge">{activeTeam.members?.length} Members</span>
            </div>
            
            <div className="member-list">
              {activeTeam.members?.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar">
                    <UserIcon size={20} />
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                  <div className="member-role">
                    {activeTeam.admin === member._id ? (
                      <span className="role-badge admin"><Shield size={12} /> Admin</span>
                    ) : (
                      <span className="role-badge member">Member</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="invite-section card">
            <h3>Invite Member</h3>
            <p>Add a registered user to your team by their email address.</p>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="user@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="invite-btn"
                disabled={addMemberMutation.isPending}
              >
                <UserPlus size={18} />
                <span>{addMemberMutation.isPending ? "Adding..." : "Add to Team"}</span>
              </button>
            </form>
            {addMemberMutation.isError && (
              <p className="error-text">{addMemberMutation.error.response?.data?.error || "Failed to add member"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;

