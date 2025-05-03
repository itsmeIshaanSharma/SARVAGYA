import React from 'react';
import './Team.css';
import mantej from '../assets/Mantej.jpeg';
import ishaan from '../assets/Ishaan.jpeg';
import dhruv from '../assets/dhruv.jpeg';
import gagan from '../assets/gagan.png';
import ayush from '../assets/ayush.jpeg';

const Team = () => {
  const teamMembers = [
    {
      name: "Mantej Singh Arora",
      role: "Project Management and Coordination",
      image: mantej
    },
    {
      name: "Ishaan Sharma",
      role: "Backend Development and Data Integration",
      image: ishaan
    },
    {
      name: "Dhruv Pandey",
      role: "Frontend Development and User Interface",
      image: dhruv
    },
    {
      name: "Gagandeep",
      role: "Data Processing and Model Optimization",
      image: gagan
    },
    {
      name: "Ayush Saini",
      role: "Testing and Quality Assurance",
      image: ayush
    }
  ];

  return (
    <div className="team-container">
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="team-card-content">
              <div className="profile-pic-frame">
                {member.image ? (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`profile-pic ${member.name === 'Ishaan Sharma' ? 'zoomed' : ''}`}
                  />
                ) : (
                  <div className="profile-pic-placeholder">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="member-name">{member.name}</h2>
              <h3 className="member-role">{member.role}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team; 