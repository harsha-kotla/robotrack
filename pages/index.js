// pages/index.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', description: '', progress: '' });
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/projects', formData);
      fetchData();
      setFormData({ name: '', category: '', description: '', progress: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEdit = (projectId) => {
    setEditMode(projectId);
  };

  const handleSave = async (projectId) => {
    try {
      await axios.put(`/api/projects/${projectId}`, formData);
      fetchData();
      setEditMode(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const groupedProjects = projects.reduce((acc, project) => {
    acc[project.category] = [...(acc[project.category] || []), project];
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Project Tracker</h1>
      <form className={styles.formContainer} onSubmit={handleCreate}>
        <input className={styles.input} type="text" placeholder="Name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}  />
        <select className={styles.select} value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} >
          <option value="">Select Category</option>
          <option value="Assembly and Wiring">Assembly and Wiring</option>
          <option value="Software">Software</option>
          <option value="Design">Design</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>
        <textarea className={styles.textarea} placeholder="Description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}  />
        <input className={styles.input} type="text" placeholder="Progress" value={formData.progress} onChange={(e) => handleInputChange('progress', e.target.value)}  />
        <button className={styles.button} type="submit">Add Project</button>
      </form>
      <div className={styles.sectionContainer}>
        {Object.keys(groupedProjects).map(category => (
          <div key={category} className={styles.section}>
            <h2>{category}</h2>
            <ul className={styles.projectList}>
              {groupedProjects[category].map(project => (
                <li className={styles.projectItem} key={project._id}>
                  {editMode === project._id ? (
                    <div>
                      <input
                        className={styles.input}
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                      <select
                        className={styles.select}
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="Assembly and Wiring">Assembly and Wiring</option>
                        <option value="Software">Software</option>
                        <option value="Design">Design</option>
                        <option value="Manufacturing">Manufacturing</option>
                      </select>
                      <textarea
                        className={styles.textarea}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                      <input
                        className={styles.input}
                        type="text"
                        value={formData.progress}
                        onChange={(e) => handleInputChange('progress', e.target.value)}
                      />
                      <button className={styles.button} onClick={() => handleSave(project._id)}>Save</button>
                      <button className={styles.button} onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <h3>{project.name}</h3>
                      <p>Description: {project.description}</p>
                      <p>Progress: {project.progress}</p>
                      <button className={styles.button} onClick={() => handleEdit(project._id)}>Edit</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
