import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/common/CourseCard';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentLevel = searchParams.get('level') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    // Fetch categories
    api.get('/categories')
      .then((res) => { if (res.data) setCategories(res.data); })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        let query = `/courses?page=${page}&size=9`;
        if (currentSearch) query += `&keyword=${encodeURIComponent(currentSearch)}`;
        if (currentCategory) query += `&categoryId=${currentCategory}`;
        if (currentLevel) query += `&level=${currentLevel}`;

        const res = await api.get(query);
        if (res.data) {
          setCourses(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentSearch, currentCategory, currentLevel, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setPage(0);
    setSearchParams(newParams);
  };

  const handleCategorySelect = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setPage(0);
    setSearchParams(newParams);
  };

  const handleLevelSelect = (lvl) => {
    const newParams = new URLSearchParams(searchParams);
    if (lvl) {
      newParams.set('level', lvl);
    } else {
      newParams.delete('level');
    }
    setPage(0);
    setSearchParams(newParams);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Explore Courses</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Discover cutting-edge engineering curriculum taught by seasoned software architects and educators.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, technology, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, marginRight: '0.25rem' }}>Category:</span>
            <button
              onClick={() => handleCategorySelect('')}
              className={`btn btn-sm ${!currentCategory ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id.toString())}
                className={`btn btn-sm ${currentCategory === c.id.toString() ? 'btn-primary' : 'btn-secondary'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Level:</span>
            {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelSelect(lvl)}
                className={`btn btn-sm ${currentLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              >
                {lvl ? lvl.charAt(0) + lvl.slice(1).toLowerCase() : 'Any'}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Courses Grid */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{courses.length}</strong> of <strong>{totalElements}</strong> courses
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading courses catalog...
        </div>
      ) : courses.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem',
          marginBottom: '3rem'
        }}>
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No Courses Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try broadening your search term or clearing filters.
          </p>
          <button
            onClick={() => { setSearchParams(new URLSearchParams()); setSearchTerm(''); }}
            className="btn btn-outline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="btn btn-secondary btn-sm"
            style={{ opacity: page === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary btn-sm"
            style={{ opacity: page >= totalPages - 1 ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default CoursesPage;
