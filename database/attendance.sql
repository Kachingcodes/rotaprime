CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL
        REFERENCES members(id)
        ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Present', 'Absent', 'Excused', 'Late')),
    marked_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, attendance_date)
);