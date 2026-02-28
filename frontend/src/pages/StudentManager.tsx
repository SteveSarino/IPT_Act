import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Crud.css';

interface Student {
  student_id?: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  email: string;
  contact_num: string;
}

const StudentManager = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student>({
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    contact_num: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.get('students');
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentStudent.student_id) {
        await api.put('students', currentStudent.student_id, currentStudent);
      } else {
        await api.post('students', currentStudent);
      }
      setCurrentStudent({
        first_name: '',
        last_name: '',
        birth_date: '',
        email: '',
        contact_num: '',
      });
      setIsEditing(false);
      fetchStudents();
    } catch (err) {
      setError('Failed to save student');
      console.error(err);
    }
  };

  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete('students', id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setCurrentStudent({
      first_name: '',
      last_name: '',
      birth_date: '',
      email: '',
      contact_num: '',
    });
    setIsEditing(false);
  };

  if (loading && students.length === 0) return <div>Loading...</div>;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Student Management</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div className="form-container">
        <h3>{isEditing ? 'Edit Student' : 'Add New Student'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              name="first_name"
              value={currentStudent.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              name="last_name"
              value={currentStudent.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Birth Date</label>
            <input
              type="date"
              name="birth_date"
              value={currentStudent.birth_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={currentStudent.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              name="contact_num"
              value={currentStudent.contact_num}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-save">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Birth Date</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{`${student.first_name} ${student.last_name}`}</td>
              <td>{student.email}</td>
              <td>{student.birth_date}</td>
              <td>{student.contact_num}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => student.student_id && handleDelete(student.student_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManager;
