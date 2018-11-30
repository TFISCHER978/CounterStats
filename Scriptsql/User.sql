CREATE OR REPLACE TABLE public."User"
(
    email character(100) NOT NULL,
    id uuid NOT NULL,
    password character(255) NOT NULL,
    pseudo character(100) NOT NULL,
    type character(50) NOT NULL,
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public."User"
    OWNER to postgres;