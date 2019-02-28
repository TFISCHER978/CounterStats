select pseudo, "T_nom" from "user"
inner join "team" on team_id = "T_id"
where pseudo = 'Tom'