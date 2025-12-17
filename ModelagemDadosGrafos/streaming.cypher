// --- 1. Criação de Constraints (Garantir unicidade) ---
CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT movie_id_unique IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT series_id_unique IF NOT EXISTS FOR (s:Series) REQUIRE s.id IS UNIQUE;

// --- 2. Criação de Usuários (10) ---
UNWIND [
  {id: 1, name: 'Alice'}, {id: 2, name: 'Bruno'}, {id: 3, name: 'Carla'}, 
  {id: 4, name: 'Daniel'}, {id: 5, name: 'Elena'}, {id: 6, name: 'Fabio'},
  {id: 7, name: 'Gisele'}, {id: 8, name: 'Hugo'}, {id: 9, name: 'Iris'}, {id: 10, name: 'João'}
] AS userData
CREATE (u:User {id: userData.id, name: userData.name});

// --- 3. Criação de Gêneros ---
CREATE (g1:Genre {name: 'Sci-Fi'}), (g2:Genre {name: 'Drama'}), (g3:Genre {name: 'Ação'});

// --- 4. Criação de Conteúdo (Filmes e Séries) ---
CREATE (m1:Movie {id: 101, title: 'Inception', year: 2010}),
       (m2:Movie {id: 102, title: 'Interstellar', year: 2014}),
       (m3:Movie {id: 103, title: 'The Dark Knight', year: 2008}),
       (m4:Movie {id: 104, title: 'Pulp Fiction', year: 1994}),
       (m5:Movie {id: 105, title: 'Matrix', year: 1999}),
       (s1:Series {id: 201, title: 'Stranger Things', seasons: 4}),
       (s2:Series {id: 202, title: 'Breaking Bad', seasons: 5}),
       (s3:Series {id: 203, title: 'The Crown', seasons: 6}),
       (s4:Series {id: 204, title: 'The Boys', seasons: 3}),
       (s5:Series {id: 205, title: 'Dark', seasons: 3});

// --- 5. Criação de Atores e Diretores ---
CREATE (a1:Actor {name: 'Leonardo DiCaprio'}),
       (a2:Actor {name: 'Cillian Murphy'}),
       (d1:Director {name: 'Christopher Nolan'}),
       (d2:Director {name: 'Quentin Tarantino'});

// --- 6. Criação de Relacionamentos ---

// Relacionar Gêneros
MATCH (m1:Movie {title: 'Inception'}), (g1:Genre {name: 'Sci-Fi'}) CREATE (m1)-[:IN_GENRE]->(g1);
MATCH (s5:Series {title: 'Dark'}), (g1:Genre {name: 'Sci-Fi'}) CREATE (s5)-[:IN_GENRE]->(g1);
MATCH (m4:Movie {title: 'Pulp Fiction'}), (g3:Genre {name: 'Ação'}) CREATE (m4)-[:IN_GENRE]->(g3);

// Relacionar Atuação e Direção
MATCH (a1:Actor {name: 'Leonardo DiCaprio'}), (m1:Movie {title: 'Inception'}) CREATE (a1)-[:ACTED_IN]->(m1);
MATCH (d1:Director {name: 'Christopher Nolan'}), (m1:Movie {title: 'Inception'}) CREATE (d1)-[:DIRECTED]->(m1);
MATCH (d1:Director {name: 'Christopher Nolan'}), (m2:Movie {title: 'Interstellar'}) CREATE (d1)-[:DIRECTED]->(m2);

// Relacionar Visualizações (WATCHED com Rating)
MATCH (u1:User {id: 1}), (m1:Movie {id: 101}) CREATE (u1)-[:WATCHED {rating: 5}]->(m1);
MATCH (u2:User {id: 2}), (m1:Movie {id: 101}) CREATE (u2)-[:WATCHED {rating: 4}]->(m1);
MATCH (u3:User {id: 3}), (s1:Series {id: 201}) CREATE (u3)-[:WATCHED {rating: 5}]->(s1);
MATCH (u4:User {id: 4}), (s2:Series {id: 202}) CREATE (u4)-[:WATCHED {rating: 5}]->(s2);
MATCH (u5:User {id: 5}), (m5:Movie {id: 105}) CREATE (u5)-[:WATCHED {rating: 3}]->(m5);
MATCH (u6:User {id: 6}), (s5:Series {id: 205}) CREATE (u6)-[:WATCHED {rating: 5}]->(s5);
MATCH (u7:User {id: 7}), (m2:Movie {id: 102}) CREATE (u7)-[:WATCHED {rating: 4}]->(m2);
MATCH (u8:User {id: 8}), (m3:Movie {id: 103}) CREATE (u8)-[:WATCHED {rating: 5}]->(m3);
MATCH (u9:User {id: 9}), (s3:Series {id: 203}) CREATE (u9)-[:WATCHED {rating: 2}]->(s3);
MATCH (u10:User {id: 10}), (s4:Series {id: 204}) CREATE (u10)-[:WATCHED {rating: 4}]->(s4);

