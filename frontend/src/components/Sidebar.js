import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Users, Calendar, BarChart2, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <CheckSquare size={20} />, label: "My Tasks", path: "/tasks" },
    { icon: <Users size={20} />, label: "Team", path: "/team" },
    { icon: <Calendar size={20} />, label: "Schedule", path: "/schedule" },
    { icon: <BarChart2 size={20} />, label: "Analytics", path: "/analytics" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">T</div>
        <span className="brand-name">TaskHub</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

