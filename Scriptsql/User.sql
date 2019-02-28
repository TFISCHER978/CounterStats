CREATE OR REPLACE TABLE public."User"
(
    email varchar(100) NOT NULL,
    id uuid NOT NULL,
    password varchar(255) NOT NULL,
    pseudo varchar(100) NOT NULL,
    manager boolean NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public."User"
    OWNER to postgres;