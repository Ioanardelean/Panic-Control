--
-- PostgreSQL database dump
--

-- Dumped from database version 10.8
-- Dumped by pg_dump version 10.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'WIN1252';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: history_status_enum; Type: TYPE; Schema: public; Owner: ioana
--

CREATE TYPE public.history_status_enum AS ENUM (
    'down',
    'up'
);


ALTER TYPE public.history_status_enum OWNER TO ioana;

--
-- Name: incident_status_enum; Type: TYPE; Schema: public; Owner: ioana
--

CREATE TYPE public.incident_status_enum AS ENUM (
    'up',
    'down',
    'none'
);


ALTER TYPE public.incident_status_enum OWNER TO ioana;

--
-- Name: monitor_status_enum; Type: TYPE; Schema: public; Owner: ioana
--

CREATE TYPE public.monitor_status_enum AS ENUM (
    'up',
    'down',
    'none'
);


ALTER TYPE public.monitor_status_enum OWNER TO ioana;

--
-- Name: project_status_enum; Type: TYPE; Schema: public; Owner: ioana
--

CREATE TYPE public.project_status_enum AS ENUM (
    'up',
    'down',
    'stopped'
);


ALTER TYPE public.project_status_enum OWNER TO ioana;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: ioana
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_role_enum OWNER TO ioana;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: history; Type: TABLE; Schema: public; Owner: ioana
--

CREATE TABLE public.history (
    id integer NOT NULL,
    status public.history_status_enum DEFAULT 'down'::public.history_status_enum NOT NULL,
    url character varying(2083) NOT NULL,
    uptime integer DEFAULT 0 NOT NULL,
    "startedAt" timestamp without time zone DEFAULT now() NOT NULL,
    project_id integer
);


ALTER TABLE public.history OWNER TO ioana;

--
-- Name: history_id_seq; Type: SEQUENCE; Schema: public; Owner: ioana
--

CREATE SEQUENCE public.history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.history_id_seq OWNER TO ioana;

--
-- Name: history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ioana
--

ALTER SEQUENCE public.history_id_seq OWNED BY public.history.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: ioana
--

CREATE TABLE public.project (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(5000),
    url character varying(2083) NOT NULL,
    receiver character varying(255) NOT NULL,
    "emailTemplate" text,
    ping integer NOT NULL,
    "monitorInterval" integer NOT NULL,
    "testRunning" boolean DEFAULT false NOT NULL,
    status public.project_status_enum DEFAULT 'stopped'::public.project_status_enum NOT NULL,
    user_id integer
);


ALTER TABLE public.project OWNER TO ioana;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: ioana
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_id_seq OWNER TO ioana;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ioana
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: ioana
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(100) NOT NULL,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updateAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO ioana;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: ioana
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO ioana;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ioana
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: history id; Type: DEFAULT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.history ALTER COLUMN id SET DEFAULT nextval('public.history_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: project PK_4d68b1358bb5b766d3e78f32f57; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY (id);


--
-- Name: history PK_9384942edf4804b38ca0ee51416; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: project UQ_8d808c7a5db7ec711bdda583398; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "UQ_8d808c7a5db7ec711bdda583398" UNIQUE (url);


--
-- Name: project UQ_dedfea394088ed136ddadeee89c; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE (name);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: project FK_1cf56b10b23971cfd07e4fc6126; Type: FK CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: history FK_e6e72e58626db59413f98aad26c; Type: FK CONSTRAINT; Schema: public; Owner: ioana
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT "FK_e6e72e58626db59413f98aad26c" FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

