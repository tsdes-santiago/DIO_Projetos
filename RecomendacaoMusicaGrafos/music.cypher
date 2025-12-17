// 1. Criar Artistas (Usando o arquivo limpo)
LOAD CSV WITH HEADERS FROM "file:///artists_clean.dat" AS row
FIELDTERMINATOR '\t'
WITH row WHERE row.id IS NOT NULL
MERGE (a:Artist {id: row.id})
SET a.name = row.name;

// 2. Criar Tags (Usando o arquivo limpo)
LOAD CSV WITH HEADERS FROM "file:///tags_clean.dat" AS row
FIELDTERMINATOR '\t'
WITH row WHERE row.tagID IS NOT NULL
MERGE (t:Tag {id: row.tagID})
SET t.value = row.tagValue;

// Criar Usuários (baseado nas interações, já que não há um users.dat isolado)
LOAD CSV WITH HEADERS FROM "file:///user_artists.dat" AS row
FIELDTERMINATOR '\t'
MERGE (u:User {id: row.userID});

// Relação de Escuta (LISTENED)
LOAD CSV WITH HEADERS FROM "file:///user_artists.dat" AS row
FIELDTERMINATOR '\t'
MATCH (u:User {id: row.userID})
MATCH (a:Artist {id: row.artistID})
MERGE (u)-[r:LISTENED]->(a)
SET r.weight = toInteger(row.weight);

// Relação de Amizade (FRIEND)
LOAD CSV WITH HEADERS FROM "file:///user_friends.dat" AS row
FIELDTERMINATOR '\t'
MATCH (u1:User {id: row.userID})
MATCH (u2:User {id: row.friendID})
MERGE (u1)-[:FRIEND]-(u2);

