SELECT
    m.id,
    m.firstname,
    m.lastname,
    m.email,
    m.position_id,
    m.status,
    p.name AS position
FROM members m
LEFT JOIN positions p
    ON p.id = m.position_id
WHERE LOWER(p.name) = 'president';