--
-- PostgreSQL database dump
--

\restrict 3iUY7i8eHOX7GLyIqAV1kSo1GyxEKssXicUFoQctIhTyeaYhOSjyR8AYekFlfRa

-- Dumped from database version 17.5
-- Dumped by pg_dump version 18.0

-- Started on 2026-01-14 13:20:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 33355)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 279604)
-- Name: audio_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audio_files (
    id integer NOT NULL,
    filename character varying,
    audio_url character varying,
    extracted_text text,
    confirmed boolean,
    status character varying,
    uploaded_at timestamp without time zone,
    user_id integer
);


ALTER TABLE public.audio_files OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 279603)
-- Name: audio_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audio_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audio_files_id_seq OWNER TO postgres;

--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 242
-- Name: audio_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audio_files_id_seq OWNED BY public.audio_files.id;


--
-- TOC entry 237 (class 1259 OID 183399)
-- Name: audio_transcriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audio_transcriptions (
    id integer NOT NULL,
    user_email character varying NOT NULL,
    bulk_upload_id integer,
    filename character varying NOT NULL,
    audio_path character varying NOT NULL,
    transcription_text character varying NOT NULL,
    language character varying,
    confirmed_at timestamp without time zone,
    created_at timestamp without time zone,
    ip_address character varying,
    processing_time character varying
);


ALTER TABLE public.audio_transcriptions OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 183398)
-- Name: audio_transcriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audio_transcriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audio_transcriptions_id_seq OWNER TO postgres;

--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 236
-- Name: audio_transcriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audio_transcriptions_id_seq OWNED BY public.audio_transcriptions.id;


--
-- TOC entry 235 (class 1259 OID 83022)
-- Name: bulk_uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bulk_uploads (
    id integer NOT NULL,
    user_email character varying NOT NULL,
    file_type character varying NOT NULL,
    filename character varying NOT NULL,
    file_path character varying NOT NULL,
    uploaded_at timestamp without time zone,
    status character varying,
    processed_at timestamp without time zone,
    error_message character varying,
    extracted_text text,
    confirmed boolean DEFAULT false,
    processing_duration character varying
);


ALTER TABLE public.bulk_uploads OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 83021)
-- Name: bulk_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bulk_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bulk_uploads_id_seq OWNER TO postgres;

--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 234
-- Name: bulk_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bulk_uploads_id_seq OWNED BY public.bulk_uploads.id;


--
-- TOC entry 231 (class 1259 OID 68058)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    type character varying NOT NULL,
    "user" character varying NOT NULL,
    action character varying NOT NULL,
    details character varying,
    "timestamp" timestamp without time zone
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 68057)
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 230
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- TOC entry 222 (class 1259 OID 33330)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    username character varying,
    message character varying NOT NULL,
    is_read boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33329)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 221
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 225 (class 1259 OID 33363)
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    email character varying NOT NULL,
    token character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean,
    created_at timestamp without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 33362)
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 224
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- TOC entry 220 (class 1259 OID 33274)
-- Name: recordings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recordings (
    id integer NOT NULL,
    username character varying,
    language character varying,
    sentence_number integer,
    audio_path character varying,
    confirmed boolean DEFAULT false
);


ALTER TABLE public.recordings OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33273)
-- Name: recordings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recordings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recordings_id_seq OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 219
-- Name: recordings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recordings_id_seq OWNED BY public.recordings.id;


--
-- TOC entry 227 (class 1259 OID 33434)
-- Name: sentences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sentences (
    id integer NOT NULL,
    language character varying(10) NOT NULL,
    sentence_number integer NOT NULL,
    sentence character varying(255) NOT NULL
);


ALTER TABLE public.sentences OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 33433)
-- Name: sentences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sentences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sentences_id_seq OWNER TO postgres;

--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 226
-- Name: sentences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sentences_id_seq OWNED BY public.sentences.id;


--
-- TOC entry 229 (class 1259 OID 68045)
-- Name: task_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_assignments (
    id integer NOT NULL,
    user_email character varying NOT NULL,
    language character varying NOT NULL,
    sentence_numbers character varying NOT NULL,
    assigned_by character varying NOT NULL,
    assigned_at timestamp without time zone,
    status character varying,
    completed_at timestamp without time zone
);


ALTER TABLE public.task_assignments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 68044)
-- Name: task_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_assignments_id_seq OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 228
-- Name: task_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_assignments_id_seq OWNED BY public.task_assignments.id;


--
-- TOC entry 241 (class 1259 OID 183426)
-- Name: tts_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tts_records (
    id integer NOT NULL,
    tts_upload_id integer NOT NULL,
    user_email character varying NOT NULL,
    text_content text NOT NULL,
    language character varying NOT NULL,
    speaker character varying NOT NULL,
    gender character varying NOT NULL,
    pitch double precision,
    pace double precision,
    loudness double precision,
    audio_format character varying,
    audio_path character varying NOT NULL,
    audio_url character varying NOT NULL,
    processing_time character varying,
    ip_address character varying,
    created_at timestamp without time zone,
    processed_at timestamp without time zone,
    from_manual_input boolean DEFAULT false
);


ALTER TABLE public.tts_records OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 183425)
-- Name: tts_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tts_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tts_records_id_seq OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 240
-- Name: tts_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tts_records_id_seq OWNED BY public.tts_records.id;


--
-- TOC entry 239 (class 1259 OID 183415)
-- Name: tts_uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tts_uploads (
    id integer NOT NULL,
    user_email character varying NOT NULL,
    filename character varying NOT NULL,
    file_path character varying NOT NULL,
    text_content text NOT NULL,
    language character varying,
    uploaded_at timestamp without time zone,
    status character varying,
    selected_for_processing boolean,
    selected_at timestamp without time zone
);


ALTER TABLE public.tts_uploads OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 183414)
-- Name: tts_uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tts_uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tts_uploads_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 238
-- Name: tts_uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tts_uploads_id_seq OWNED BY public.tts_uploads.id;


--
-- TOC entry 218 (class 1259 OID 33262)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    email character varying NOT NULL,
    dob date,
    contactno character varying,
    place character varying,
    city character varying,
    state character varying,
    pincode character varying,
    gender character varying,
    password character varying NOT NULL,
    account_created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying DEFAULT 'user'::character varying,
    status character varying DEFAULT 'Pending'::character varying,
    password_reset_requested boolean,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 33261)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 233 (class 1259 OID 83011)
-- Name: video_task_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video_task_assignments (
    id integer NOT NULL,
    user_email character varying NOT NULL,
    video_filename character varying NOT NULL,
    video_path character varying NOT NULL,
    assigned_by character varying NOT NULL,
    assigned_at timestamp without time zone,
    status character varying,
    completed_at timestamp without time zone,
    extracted_text character varying,
    shared_with_admin boolean,
    shared_at timestamp without time zone
);


ALTER TABLE public.video_task_assignments OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 83010)
-- Name: video_task_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_task_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_task_assignments_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 232
-- Name: video_task_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_task_assignments_id_seq OWNED BY public.video_task_assignments.id;


--
-- TOC entry 245 (class 1259 OID 287789)
-- Name: video_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.video_tasks (
    id integer NOT NULL,
    user_email character varying,
    video_filename character varying,
    video_path character varying,
    extracted_text text,
    status character varying,
    language character varying,
    shared_with_admin boolean,
    error_message text,
    created_at timestamp without time zone,
    processed_at timestamp without time zone
);


ALTER TABLE public.video_tasks OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 287788)
-- Name: video_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.video_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.video_tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 244
-- Name: video_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.video_tasks_id_seq OWNED BY public.video_tasks.id;


--
-- TOC entry 4830 (class 2604 OID 279607)
-- Name: audio_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audio_files ALTER COLUMN id SET DEFAULT nextval('public.audio_files_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 183402)
-- Name: audio_transcriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audio_transcriptions ALTER COLUMN id SET DEFAULT nextval('public.audio_transcriptions_id_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 83025)
-- Name: bulk_uploads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulk_uploads ALTER COLUMN id SET DEFAULT nextval('public.bulk_uploads_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 68061)
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 33333)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4819 (class 2604 OID 33366)
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 33277)
-- Name: recordings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings ALTER COLUMN id SET DEFAULT nextval('public.recordings_id_seq'::regclass);


--
-- TOC entry 4820 (class 2604 OID 33437)
-- Name: sentences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentences ALTER COLUMN id SET DEFAULT nextval('public.sentences_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 68048)
-- Name: task_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments ALTER COLUMN id SET DEFAULT nextval('public.task_assignments_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 183429)
-- Name: tts_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_records ALTER COLUMN id SET DEFAULT nextval('public.tts_records_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 183418)
-- Name: tts_uploads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_uploads ALTER COLUMN id SET DEFAULT nextval('public.tts_uploads_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 33265)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 83014)
-- Name: video_task_assignments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_task_assignments ALTER COLUMN id SET DEFAULT nextval('public.video_task_assignments_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 287792)
-- Name: video_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_tasks ALTER COLUMN id SET DEFAULT nextval('public.video_tasks_id_seq'::regclass);


--
-- TOC entry 5043 (class 0 OID 33355)
-- Dependencies: 223
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
7a284eafb743
\.


--
-- TOC entry 5063 (class 0 OID 279604)
-- Dependencies: 243
-- Data for Name: audio_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audio_files (id, filename, audio_url, extracted_text, confirmed, status, uploaded_at, user_id) FROM stdin;
13	mp3_44100Hz_320kbps_stereo.mp3	/uploads/30cb692f83b74ffab6b85b5d310156b9.mp3	You are listening to a sample MP3 audio file provided by samplefiles.com.	t	uploaded	2026-01-13 05:12:01.673746	9
\.


--
-- TOC entry 5057 (class 0 OID 183399)
-- Dependencies: 237
-- Data for Name: audio_transcriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audio_transcriptions (id, user_email, bulk_upload_id, filename, audio_path, transcription_text, language, confirmed_at, created_at, ip_address, processing_time) FROM stdin;
25	go.teamchai@gmail.com	\N	mp3_44100Hz_320kbps_stereo.mp3	/uploads/30cb692f83b74ffab6b85b5d310156b9.mp3	You are listening to a sample MP3 audio file provided by samplefiles.com.	unknown	2026-01-13 07:14:41.557244	2026-01-13 07:14:41.566772	\N	\N
\.


--
-- TOC entry 5055 (class 0 OID 83022)
-- Dependencies: 235
-- Data for Name: bulk_uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bulk_uploads (id, user_email, file_type, filename, file_path, uploaded_at, status, processed_at, error_message, extracted_text, confirmed, processing_duration) FROM stdin;
46	go.teamchai@gmail.com	MP3	mp3_44100Hz_320kbps_stereo.mp3	/uploads/55f1a796284945cd84abbd67df74ba6b.mp3	2026-01-13 02:26:26.44402	uploaded	\N	\N	\N	f	\N
47	go.teamchai@gmail.com	MP3	mp3_44100Hz_320kbps_stereo.mp3	/uploads/8577bb844ecd471c9912e2582d072242.mp3	2026-01-13 02:41:47.634994	uploaded	\N	\N	\N	f	\N
48	go.teamchai@gmail.com	MP3	mp3_44100Hz_320kbps_stereo.mp3	/uploads/e38bb6654504487d9430b6e32a5fe25f.mp3	2026-01-13 05:05:21.142866	uploaded	\N	\N	\N	f	\N
49	go.teamchai@gmail.com	MP3	mp3_44100Hz_320kbps_stereo.mp3	/uploads/b605026027cc4867b75e0240c998c593.mp3	2026-01-13 05:08:20.759287	uploaded	\N	\N	\N	f	\N
50	go.teamchai@gmail.com	MP3	mp3_44100Hz_320kbps_stereo.mp3	/uploads/30cb692f83b74ffab6b85b5d310156b9.mp3	2026-01-13 05:12:01.692557	uploaded	\N	\N	\N	f	\N
\.


--
-- TOC entry 5051 (class 0 OID 68058)
-- Dependencies: 231
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs (id, type, "user", action, details, "timestamp") FROM stdin;
8	task_assignment	admin@gmail.com	Assigned 1 tasks to admin@gmail.com	Language: en, Tasks: [1]	2025-10-11 07:51:02.273496
9	record_deleted	admin	Deleted recording for admin@gmail.com	Language: en, Sentence: 1, Text: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	2025-11-19 10:14:02.508396
\.


--
-- TOC entry 5042 (class 0 OID 33330)
-- Dependencies: 222
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, username, message, is_read, created_at) FROM stdin;
1	sureshkannanbe001@gmail.com	Your recording for sentence 1 in en was deleted and reassigned.	t	2025-07-25 17:37:23.506183
2	sureshkannanbe001@gmail.com	Your recording for sentence 2 in en was deleted and reassigned.	t	2025-07-25 17:52:37.94895
3	sureshkannanbe001@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	t	2025-07-25 17:57:35.741608
4	sureshkannanbe001@gmail.com	Your recording for sentence 3 in en was deleted and reassigned. Sentence: 'Prior to his parliamentary role, Shri Patel served as the Member of the Uttar Pradesh Legislative Assembly for Phulpur from 2017 until June 2024.'	t	2025-07-25 18:09:08.490622
5	sureshkannanbe001@gmail.com	Your recording for sentence 3 in en was deleted and reassigned. Sentence: 'Prior to his parliamentary role, Shri Patel served as the Member of the Uttar Pradesh Legislative Assembly for Phulpur from 2017 until June 2024.'	t	2025-07-25 18:20:17.219718
6	sureshkannanbe001@gmail.com	Your recording for sentence 4 in en was deleted and reassigned. Sentence: 'Phulpur, historically significant as the constituency of India's first Prime Minister, Jawaharlal Nehru, and former Prime Minister V. P. Singh, is known for its rich cultural heritage and agricultural prominence.'	t	2025-07-25 18:21:34.65538
7	sureshkannanbe001@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	t	2025-07-25 18:21:41.490234
8	sureshkannanbe001@gmail.com	Your recording for sentence 11 in en was deleted and reassigned. Sentence: 'Shri Narayan Das Ahirwar, a seasoned politician from the Samajwadi Party, represents the Jalaun constituency in Uttar Pradesh.'	t	2025-07-25 18:22:25.157713
9	varshaeswaran@gmail.com	Your recording for sentence 6 in en was deleted and reassigned. Sentence: 'Shri Tanuj Punia, a 39-year-old graduate in chemical engineering from IIT Roorkee, represents the Barabanki constituency in Uttar Pradesh as a Member of Parliament from the Indian National Congress.'	f	2025-07-25 18:26:44.288019
10	varshaeswaran@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	f	2025-07-25 18:26:50.282975
11	go.teamchai@gmail.com	Your recording for sentence 1 in hi was deleted and reassigned. Sentence: 'श्री कृष्णा देवी शिवशंकर पटेल, समाजवादी पार्टी की 54 वर्षीय सदस्य, उत्तर प्रदेश के बांदा क्षेत्र का प्रतिनिधित्व करती हैं। उन्होंने 2024 के लोकसभा चुनाव में भाजपा के आर.के. सिंह पटेल को 71,210 मतों से हराकर सीट जीती।'	t	2025-07-29 09:01:04.285157
12	go.teamchai@gmail.com	Your recording for sentence 1 in ta was deleted and reassigned. Sentence: 'சமாஜ்வாதி கட்சியை சேர்ந்த 54 வயதான திரு கிருஷ்ணா தேவி சிவ்ஷங்கர் பட்டேல், உத்தர பிரதேச மாநிலத்தில் உள்ள பண்டா தொகுதியை பிரதிநிதித்துவப்படுத்துகிறார். 2024 மக்களவைத் தேர்தலில், பாஜகவின் ஆர். கே. சிங் பட்டேலை 71,210 வாக்குகள் வித்தியாசத்தில் வென்று தனது இடத்தை உறுதிசெய்தார்.'	t	2025-07-30 08:47:59.176556
16	varshaeswaran@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-04 19:46:34.864903
17	varshaeswaran@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-04 19:49:07.985476
18	varshaeswaran@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-04 20:11:15.224141
20	varshaeswaran@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-04 20:14:10.432241
21	varshaeswaran@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-04 20:22:34.109595
14	newssk@gmail.com	Your recording for sentence 3 in en was deleted and reassigned. Sentence: 'Prior to his parliamentary role, Shri Patel served as the Member of the Uttar Pradesh Legislative Assembly for Phulpur from 2017 until June 2024.'	t	2025-09-04 12:38:07.805487
15	newssk@gmail.com	You have been assigned 6 tasks in en language. Please check your dashboard.	t	2025-09-04 19:12:48.320107
19	newssk@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-04 20:11:23.833232
22	newssk@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-04 20:25:35.650916
23	newssk@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-04 20:28:05.97887
24	newssk@gmail.com	You have been assigned 5 tasks in en language. Please check your dashboard.	t	2025-09-04 20:38:30.502631
13	sureshkannanbe001@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	t	2025-08-07 07:50:32.628519
25	newssk@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	t	2025-09-04 20:46:38.319568
26	newssk@gmail.com	You have been assigned 1 tasks in hi language. Please check your dashboard.	t	2025-09-04 20:49:45.262546
27	newssk@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-04 20:56:37.945354
28	newssk@gmail.com	You have been assigned 1 tasks in hi language. Please check your dashboard.	t	2025-09-04 20:56:49.363329
29	newssk@gmail.com	You have been assigned 1 tasks in kn language. Please check your dashboard.	t	2025-09-04 21:00:37.162281
30	newssk@gmail.com	You have been assigned 1 tasks in ta language. Please check your dashboard.	t	2025-09-04 21:00:48.582404
31	newssk@gmail.com	You have been assigned 1 tasks in te language. Please check your dashboard.	t	2025-09-04 21:01:00.136407
32	sureshkannanbe001@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-04 21:05:57.863952
33	varshaeswaran@gmail.com	You have been assigned 1 tasks in hi language. Please check your dashboard.	f	2025-09-05 04:14:31.423366
34	varshaeswaran@gmail.com	You have been assigned 1 tasks in hi language. Please check your dashboard.	f	2025-09-05 04:14:43.157355
35	varshaeswaran@gmail.com	You have been assigned 1 tasks in ta language. Please check your dashboard.	f	2025-09-05 04:15:54.075058
36	newssk@gmail.com	Your recording for sentence 1 in ta was deleted and reassigned. Sentence: 'சமாஜ்வாதி கட்சியை சேர்ந்த 54 வயதான திரு கிருஷ்ணா தேவி சிவ்ஷங்கர் பட்டேல், உத்தர பிரதேச மாநிலத்தில் உள்ள பண்டா தொகுதியை பிரதிநிதித்துவப்படுத்துகிறார். 2024 மக்களவைத் தேர்தலில், பாஜகவின் ஆர். கே. சிங் பட்டேலை 71,210 வாக்குகள் வித்தியாசத்தில் வென்று தனது இடத்தை உறுதிசெய்தார்.'	t	2025-09-05 04:23:23.507698
37	go.teamchai@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-09-05 04:27:21.739542
38	go.teamchai@gmail.com	You have been assigned 2 tasks in ta language. Please check your dashboard.	f	2025-09-05 04:27:38.624516
39	admin@gmail.com	You have been assigned 6 tasks in en language. Please check your dashboard.	t	2025-09-10 11:24:00.165181
40	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	t	2025-09-10 16:32:00.567132
41	admin@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	t	2025-09-10 17:30:58.5082
42	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	t	2025-09-10 17:31:20.746898
43	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	t	2025-09-10 17:33:56.278365
44	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	t	2025-09-10 17:44:23.680217
45	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-10 18:42:10.044253
46	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-10 19:26:12.494477
47	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-10 19:31:00.923175
48	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-10 19:39:43.811703
49	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-11 04:52:57.343319
50	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-11 06:56:40.706125
51	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-11 07:08:30.060048
52	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-11 07:39:39.768757
53	admin@gmail.com	You have been assigned a video file '2 Win-deh.mp4' for speech-to-text processing. Please check your dashboard.	f	2025-09-11 10:31:42.161443
54	admin@gmail.com	You have been assigned 1 tasks in en language. Please check your dashboard.	f	2025-10-11 07:51:02.252385
55	admin@gmail.com	Your recording for sentence 1 in en was deleted and reassigned. Sentence: 'Shri Krishna Devi Shivshanker Patel, a 54-year-old member of the Samajwadi Party, represents the Banda constituency in Uttar Pradesh. She secured her seat in the 2024 Lok Sabha elections, defeating R.K. Singh Patel of the BJP by a margin of 71,210 votes.'	f	2025-11-19 10:14:02.494982
\.


--
-- TOC entry 5045 (class 0 OID 33363)
-- Dependencies: 225
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, email, token, expires_at, used, created_at) FROM stdin;
2	sureshkannanbe001@gmail.com	p9OtcjDqAqcoXdGh1hQghS7X_AbF2_f8RX4VMFhB5js	2025-07-27 12:58:05.580611	f	2025-07-26 12:58:05.584214
3	go.teamchai@gmail.com	r6_lJKM3wpgvGjEg-MoW96xM1pJjn8hjo4ComNerJQ8	2025-07-27 15:04:32.769651	f	2025-07-26 15:04:32.771191
4	go.teamchai@gmail.com	uTPr2OVXrkH4dytU_2QCREWnLp0bgqsbzRCBDmEu4wI	2025-07-27 15:05:36.924534	t	2025-07-26 15:05:36.924843
5	go.teamchai@gmail.com	yfKKnHnjGCCFKncHzgGxfHDxneZiIjcuIciSWrgCbCw	2025-07-27 15:13:21.700776	f	2025-07-26 15:13:21.701108
6	sureshkannanbe001@gmail.com	r4j9zXn-fg-7Ar8NmWhhFToZgsf7ALwZ5BhyW4fkcuU	2025-07-27 15:14:43.2798	f	2025-07-26 15:14:43.280226
7	sureshkannanbe001@gmail.com	L0PViWDWMxI_E3kf2kp8zH_u9T3Zw6nd_IBqMgCWyaQ	2025-07-27 16:27:46.403583	f	2025-07-26 16:27:46.407928
8	sureshkannanbe001@gmail.com	aixHmX1oQWtGcPzYm2um90NiST05_cMimJ9wVq6Qcr0	2025-07-27 16:32:28.430059	f	2025-07-26 16:32:28.430686
9	sureshkannanbe001@gmail.com	tHeZRm_lNU6MSxxYbUoaHj3jUPmbqJCUYTD1ToUzDLU	2025-07-28 12:24:51.06108	f	2025-07-27 12:24:51.107726
10	sureshkannanbe001@gmail.com	23ldAtYAddfN_ZXd983ursX5HA82FgZw9NyslW3SmNc	2025-07-29 04:56:23.288292	f	2025-07-28 04:56:23.324817
\.


--
-- TOC entry 5040 (class 0 OID 33274)
-- Dependencies: 220
-- Data for Name: recordings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recordings (id, username, language, sentence_number, audio_path, confirmed) FROM stdin;
\.


--
-- TOC entry 5047 (class 0 OID 33434)
-- Dependencies: 227
-- Data for Name: sentences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sentences (id, language, sentence_number, sentence) FROM stdin;
\.


--
-- TOC entry 5049 (class 0 OID 68045)
-- Dependencies: 229
-- Data for Name: task_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_assignments (id, user_email, language, sentence_numbers, assigned_by, assigned_at, status, completed_at) FROM stdin;
25	admin@gmail.com	en	[1]	admin@gmail.com	2025-10-11 07:51:02.215834	assigned	\N
\.


--
-- TOC entry 5061 (class 0 OID 183426)
-- Dependencies: 241
-- Data for Name: tts_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tts_records (id, tts_upload_id, user_email, text_content, language, speaker, gender, pitch, pace, loudness, audio_format, audio_path, audio_url, processing_time, ip_address, created_at, processed_at, from_manual_input) FROM stdin;
\.


--
-- TOC entry 5059 (class 0 OID 183415)
-- Dependencies: 239
-- Data for Name: tts_uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tts_uploads (id, user_email, filename, file_path, text_content, language, uploaded_at, status, selected_for_processing, selected_at) FROM stdin;
19	admin@gmail.com	tts_audio.wav_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_155732_tts_audio.wav_transcription.txt	మీకు కావాలంటే, మీ బ్యాకెండ్ DevTunnel URL మరియు మీ API కాల్ కోడ్ (login.jsx) నాకు పంపండి, నేను మీ కోసం ఖచ్చితమైన కోడ్‌ను అప్‌డేట్ చేస్తాను.	\N	2025-11-26 10:27:32.165594	completed	f	2025-11-26 10:27:47.302622
17	admin@gmail.com	typed_text_1764152679652.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_155439_typed_text_1764152679652.txt	अगर आप चाहें, तो मुझे अपना बैकएंड DevTunnel URL और अपना API कॉल कोड (login.jsx) भेजें, मैं आपके लिए सही कोड अपडेट कर दूंगा।	Hindi	2025-11-26 10:24:39.663544	completed	f	2025-11-26 10:24:39.698146
23	admin@gmail.com	checking.wav_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_170246_checking.wav_transcription.txt	మీకు కావాలంటే మీ బ్యాక్ ఎండ్ డివిడెన్షియల్ యుఆర్ఎల్ ఆర్ యాప్ కి ఐ కాల్ కోడ్ login.jsx నాకు పంపండి. నేను మీ కోసం ఖచ్చితమైన కోడ్ ను అప్డేట్ చేస్తాను.	\N	2025-11-26 11:32:46.09842	uploaded	f	\N
32	go.teamchai@gmail.com	typed_text_1768220221553.txt	typed_text_1768220221553.txt	how are you	\N	2026-01-12 12:17:01.90889	uploaded	f	\N
18	admin@gmail.com	typed_text_1764152747932.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_155547_typed_text_1764152747932.txt	మీకు కావాలంటే, మీ బ్యాకెండ్ DevTunnel URL మరియు మీ API కాల్ కోడ్ (login.jsx) నాకు పంపండి, నేను మీ కోసం ఖచ్చితమైన కోడ్‌ను అప్‌డేట్ చేస్తాను.	Telugu	2025-11-26 10:25:47.943701	completed	f	2025-11-26 10:25:47.995209
20	admin@gmail.com	typed_text_1764154146406.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_161906_typed_text_1764154146406.txt	prajitha, when are you plan to marry a pretty man	English	2025-11-26 10:49:06.743081	completed	f	2025-11-26 10:49:06.784208
29	admin@gmail.com	typed_text_1764314291934.txt	E:\\ruthi-etv\\ETV\\etv-asr\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251128_124812_typed_text_1764314291934.txt	hedss asdsade asdasdasd	English	2025-11-28 07:18:12.029694	preview_generated	t	2025-11-28 07:18:12.214254
24	admin@gmail.com	checking.wav_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_170552_checking.wav_transcription.txt	మీకు కావాలంటే మీ బ్యాక్ ఎండ్ డివిడెన్షియల్ యుఆర్ఎల్ ఆర్ యాప్ కి ఐ కాల్ కోడ్ login.jsx నాకు పంపండి. నేను మీ కోసం ఖచ్చితమైన కోడ్ ను అప్డేట్ చేస్తాను.	\N	2025-11-26 11:35:52.427322	preview_generated	t	2025-11-26 11:36:12.022121
21	admin@gmail.com	typed_text_1764155961313.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_164921_typed_text_1764155961313.txt	मैं आपको यह बताना चाहता हूँ कि मैं केवल शाम को ही उपलब्ध रहूँगा। मुझे रिश्तेदारों को आमंत्रित करना है और आने वाले कार्यक्रम के लिए आवश्यक सामान भी लेना है। मैं सभी तैयारियाँ समय पर पूरा कर दूँगा, और अगर कुछ और ज़रूरत हो तो कृपया मुझे बता दें।	Hindi	2025-11-26 11:19:21.664056	preview_generated	t	2025-11-26 11:19:21.713082
25	admin@gmail.com	tts_audio.wav_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_222924_tts_audio.wav_transcription.txt	మీకు కావాలంటే, మీ బ్యాకెండ్ DevTunnel URL మరియు మీ API కాల్ కోడ్ (login.jsx) నాకు పంపండి, నేను మీ కోసం ఖచ్చితమైన కోడ్‌ను అప్‌డేట్ చేస్తాను.	\N	2025-11-26 16:59:24.894437	uploaded	f	\N
16	admin@gmail.com	typed_text_1764152609892.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251126_155329_typed_text_1764152609892.txt	If you want, send me your backend DevTunnel URL and your API call code (login.jsx), I will update the exact code for you.	English	2025-11-26 10:23:29.90814	completed	f	2025-11-26 10:23:29.944409
27	admin@gmail.com	Hindi_Sample_1 - Copy.mp4_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251127_100128_Hindi_Sample_1 - Copy.mp4_transcription.txt	उनके सामने उनकी 11 एयर बेसेस डिस्ट्रॉयड है। प्राइम मिनिस्टर खुद कह रहे हैं कि नूरखान पे मजाइले गिरी हैं। लोकल उनके जो वीडियो बना बना के ये भावरपुर का वीडियो है, ये नूरखान का वीडियो है। वहां से एक वो स्टेटमेंट देते हैं कि मैं न्यूक्लियर वेपन से आधे दुनिया को तबाह कर दूंगा। आई सी मोस्ट इररिस्पांसिबल स्टेटमेंट बाय एनी ऑफिशियल ऑफ अ न्यूक्लियर पावर स्टेट। मोस्ट इररिस्पांसिबल। अगर वो ये कह रहा है कि मैं मिसाइल चला के आपका डैम को तबाह कर दूंगा, तो हमें नहीं मालूम कि मंगला डैम कहां पे है, हमें नहीं मालूम मुराला हेडवर्क कहां पे है, हमें नहीं मालूम गुड्डू ब्राज कहां पे है, हमें नहीं मालूम सकर ब्राज कहां पे है। और हमारी मिसाइल तो बिल्कुल प्रिसाइज आती है। पाकिस्तान दोबारा कोई टेररिस्ट की टेररिज्म की हरकत करता है तो इंडिया विल रिएक्ट बैक। पीओके के लोग आर जस्ट नॉट हैप्पी विद पाकिस्तानी पंजाबी मुसलमान। अलवामा हुआ, बालाकोट हुआ, 370 एब्रोगेशन मैं कश्मीर में कोर्ट में था। छोटी-छोटी बात के ऊपर वहां पे हड़ताल हो जाती थी और लोग सड़कों पे आ जाते थे, गोलियां चल जाती थी।\nतो आर्टिकल 370 के ऊपर तो लोगों ने सोचा था पता नहीं क्या ही बवाल आएगा कश्मीर में।\nइन एडिशन टू पाकिस्तान, पाकिस्तान आर्मी, आईएसआई।\nइन ये सारा इकोसिस्टम जो है ना, ये कश्मीर की प्रॉब्लम से फायदे में है। लोकल कश्मीरी खैरिस। तो आम करके उसकी जेब से एक चिट्ठी मिलती थी। जहां तो वो चिट्ठी उसने अपनी मां को लिखी होती थी, क्योंकि उन दिनों मोबाइल तो होते नहीं थे। जहां वो चिट्ठी उसकी मां ने लिखी होती थी और उसने वो पढ़ के अपनी जेब में रखी थी। एक तो थिंग वेयर इट बिलोंग्स। एक लड़का है वो अपनी मदर के पास ही बिलोंग करता है, उसको वापस अपनी मदर के पास जाना है, जाना चाहिए। नो सन शुड बी विदाउट अ मदर एंड नो मदर शुड बी विदाउट अ सन। नमस्कार, आप देख रहे हैं टीवी9 भारतवर्ष। मैं हूं अरुण सुंदराल। कश्मीर की वादियों से जुड़ी एक ऐसी सच्ची कहानी जो एक ऑपरेशन नहीं, दिलों को जोड़ने का प्रयास है। ऑपरेशन मां। क्या पहल है ये? इस पहल के पीछे रहे रिटायर्ड लेफ्टिनेंट जनरल के. जे. एस. ढिल्लोंजी आज हमारे साथ स्टूडियो पे मौजूद हैं। सर, बहुत-बहुत आपका स्वागत है यहां पर। सबसे पहले हमारे जो दर्शक हैं, वो जानना चाहेंगे कि आखिर कश्मीर में बड़ा बदलाव लाने वाला ये ऑपरेशन मां है क्या? \n थैंक यू अरुण और अगर मैं इसको शुरू से बताना शुरू करूं तो जब मैं एक यंग कैप्टन था और 1988 में जब मैं पहली बार कश्मीर गया और वो वो दौर था जब आतंकवाद कश्मीर में नया-नया शुरू हुआ था और जब भी कभी कोई एनकाउंटर होता था तो जो भी कोई टेररिस्ट जो मरता था लोकल कश्मीरी टेररिस्ट तो आम करके उसकी जेब से एक चिट्ठी मिलती थी। जहां तो वो चिट्ठी उसने अपनी मां को लिखी होती थी क्योंकि उन दिनों मोबाइल तो होते नहीं थे। जहां वो चिट्ठी उसकी मां ने लिखी होती थी और उसने वो पढ़ के अपनी जेब में रखी होती थी। और उस चिट्ठी को क्योंकि इंटेलिजेंस पॉइंट ऑफ व्यू से भी उसका चेक करना जरूरी रहता है तो उस आम करके उस चिट्ठी का जो मेन थीम रहता था कि अम्मी जान को सलाम, अम्मी जान को बताना, दुआओं में याद रखना, अम्मी जान के लिए दुआ करना, मेरे लिए दुआ करना। सो 90% मदर के लिए रहती थी रेफरेंस, बाकी 10% मोस्टली सिस्टर के लिए, कभी ब्रदर के लिए और बहुत कम फादर के लिए। तो ये जो चीज थी, ये मेरे दिमाग में उस समय जब मैं यंग कैप्टन था तब से थी। और जब मैं कोर कमांडर बना 2019 में, फरवरी 2019 में, तो सबसे पहली चीज जो मैंने की। मैंने कहा अगर एक लड़का अपनी मां से इतना प्यार करता है और हर सोसाइटी में मां का एक बहुत बड़ा ओहदा है, एक बहुत बड़ा महत्व है, एक प्लेस है। जी। लेकिन कश्मीरी सोसाइटी में जो मैंने देखा अपने 6-7 टेन्योर जो मेरे कश्मीर के हैं, वहां पर मां का एक बहुत ज्यादा प्रभाव रहता है बच्चों के ऊपर। सो उस बैकग्राउंड से मैंने ये शुरू किया कि क्यों ना हम मदर्स को कांटेक्ट करें। कि जिनके बच्चों ने गन उठाई है कि वो अपने बच्चे को बोले तू वापस आ और तेरी हिफाजत रहेगी, तेरे सीक्रेसी रहेगी, तेरे खिलाफ कोई केस नहीं होगा। ये जो कंडीशंस हैं, दीज़ एश्योरेंस इज़ वर अ मस्ट। एंड दे हैड टू बी ऑनर्ड। एंड वंस दिस वर्ड वेंट अराउंड एंड फर्स्ट बॉय हु सरेंडर्ड उसके खिलाफ कोई केस नहीं बना। उसको एक अल्टरनेट जॉब के लिए बताया गया और उसका नाम भी गुप्त रखा गया। तो फिर बाय एंड बाय। जैसे हम बात कर रहे थे फिर काफिला जुड़ता गया और कारवां बनता गया। तो दिस वास द फर्स्ट ऑफ इट्स काइंड पीस इनिशिएटिव बाय अ मिलिट्री कमांडर इन अ कॉन्फ्लिक्ट ज़ोन इन द होल वर्ल्ड। दैट्स व्हाट आई हैव बीन टोल्ड। यह जो ऑपरेशन आपने चलाया, आपने जमीनी स्तर पर इसका कितना असर देखा?  जो आतंकवाद के मामले थे या जो कश्मीरी युवा थे जो आतंकवाद की ओर रुख कर रहे थे, उन्हें वापस लाने में कितना योगदान इस ऑपरेशन ने दिया? देखिए जैसे मैं आपसे बात कर रहा था, करीब-करीब 50 के करीब लड़के, 50 से ज्यादा तो जो मेरा टेन्योर होता था 2019-20।\n उसी दौरान ही वापस आ गए थे।\nऔर अभी जैसे ऑपरेशन मां के ऊपर जो डॉक्यूमेंट्री है, डोकूबे में रिलीज हो रही है 27 अगस्त को।\nजी।\nउसमें जो रिसर्च डाटा है, उसके हिसाब से\n\n17 लड़के वापस आए हैं और ये एक बहुत बड़ी बात है। बिल्कुल। आज की तारीख में मैं कश्मीर में था पहलगाम अटैक के एक दिन पहले 21 अप्रैल को। तो मुझे बताया गया था कि जो पलवामा जहां पे मेन हॉट बेट था। पिछले 2 साल से एक भी कश्मीरी लड़के ने गन नहीं उठाई है। और इस बात में कहीं ना कहीं ऑपरेशन मां का बहुत बड़ा योगदान है। क्योंकि मदर्स ने ये जब अपने बच्चों को बोला कि बेटा ये रास्ता ठीक नहीं है। इस रास्ते का अंत सिर्फ गोली या मौत है। और बच्चे समझे और देखिए साइकिल है। पीस आया तो बच्चों को जॉब मिला। जॉब मिला तो घर में पैसा आना शुरू हुआ। पैसा आना शुरू हुआ तो आतंकवाद की तरफ ध्यान हटना बंद हो गया। आतंकवाद की तरफ ध्यान हटना बंद हुआ तो वापस पीस आया। फिर पीस आया तो जॉब पैसा। तो ये साइकिल जो है, अभी चल रहा है और आगे हमेशा तरक्की पे रहेगा।\nआपको क्या लगता है कि जिस तरह से आपने जिक्र किया कि कोई भी मां या कोई भी अपना पेरेंट्स नहीं चाहेंगे कि उनका जो बेटा है इस तरह से अलगाववाद में जाए या इस तरह से जो है एक्शन ले।\nतो क्या मोटिव रहता है युवाओं का क्या  किस तरह से उनकी ब्रेन वाशिंग होती है, ये क्या साइकिल है इस पर मुझे लगता है कि ज़ोर डालना चाहिए। देखिए अगेन कश्मीर में ना एक इकोसिस्टम काम करता है। उस इकोसिस्टम में शामिल है हुरियत, आतंकवादी, टेररिस्ट एम्पेथाइज़र्स, ओवरग्राउंड वर्कर्स और जो वाइट कॉलर टेररिस्ट हैं, उसके अलावा कुछ। जो लोकल पॉलिटिकल एलिमेंट्स हैं, कुछ एनजीओज़ हैं और कुछ लोकल जो जिसको हम कहते हैं कि लोकल मीडिया आल्सो। इन एडिशन टू पाकिस्तान, पाकिस्तान आर्मी, आईएसआई। इन ये सारा इकोसिस्टम जो है ना, ये कश्मीर की प्रॉब्लम से फायदे में है। जब तक कश्मीर में टेररिज्म चलेगा, जब तक कश्मीर में आतंकवाद चलेगा, ये इकोसिस्टम पनपता रहेगा, इनकी रोटियां सिकती रहेंगी। तो इसी इकोसिस्टम का हिस्सा जैसे मैंने बोला जब मैं 1988 में गया। तो जब टेररिज्म शुरू हुआ तो सबसे पहले उन्होंने क्या किया? उस टाइम पर लकड़ी के यू नो फॉर फ्लमिंग एरियाज में विलेजेस में विलेजेस में स्कूल्स जो थे लकड़ी के होते थे। उन्होंने स्कूलों को आग लगाई। रीज़न ये दिया कि इसमें फ़ौज आके अपना कैम्प बनाएगी। लेकिन एक्चुअल रीज़न था कि स्कूल जला दो। कश्मीरी पंडित जब 1989 ऑनवर्ड्स उनको जब वहां से निकाला गया, एक एक्सोडस हुआ। एक्सोडस हुआ और कश्मीरी पंडित्स कश्मीर के एजुकेशन सिस्टम का मेन स्टे थे। चाहे वो प्राइमरी स्कूल टीचर है, चाहे मिडिल स्कूल, हाई स्कूल, कॉलेज और यूनिवर्सिटी। हर जगह पे कश्मीरी पंडित्स बिकॉज़ दे वर अ एजुकेटेड कम्युनिटी। कश्मीरी पंडित्स का योगदान कश्मीर के एजुकेशन में सबसे ज्यादा था। एक तरफ तो आपके टीचर आपने वहां से निकाल दिए। दूसरी तरफ जो स्कूल की बिल्डिंग थी उसको जला दिया। तो बच्चे के पास जहां तो बिल्कुल पढ़ाई ना करे, जहां करे तो लोकल। मदरसा में जाएगा। ये ये बहुत इंपॉर्टेंट पॉइंट आपने उठाया कि कश्मीरी पंडित्स जो हैं वो एक इंपॉर्टेंट एजुकेशन में उनका रोल रहा। क्या ये सिस्टमैटिकली उनको हटाने की कोशिश थी जितने भी ये जो इकोसिस्टम था? वो डेलिब्रेटली ये चाहता था कि वो हट जाएं और जो यूथ है उनको वैसी एजुकेशन ना मिल पाए जो एक यूथ को आगे जॉब के लिए स्पेसिफिक स्किल्स प्रोवाइड करती है और उन्हें दूसरे राह पर जो आज हम देखते हैं या समय में देखा हमने। उस समय पे इंटरनेट नहीं था, मोबाइल्स नहीं थे, अवेयरनेस नहीं थी और जो भी कुछ बताया जाता था लोकल एनवायरमेंट में। उसको सच माना जाता था। चाहे वो मदरसे में आपके मौलवी साहब बताएं, चाहे आपके किसी रिलीजियस प्लेस के ऊपर आपको नरेशन दी जाए या आपके आस-पड़ोस वाले लोग बताएं, तो वो एक बच्चे का दिमाग को फिक्सेट करता था। रेडिकलाइजेशन की तरफ। जबकि प्रॉपर एजुकेशन सिस्टम था नहीं, कोई उसके ऊपर चेक्स एंड बैलेंसेस नहीं थे और ऊपर से कोई भी जॉब अपॉर्चुनिटीज नहीं थी और ये बच्चा जब 15, 16, 17 साल का होता है। और कॉलेज में एडमिशन के लिए अप्लाई करता है या किसी इंजीनियरिंग कॉलेज में या मेडिकल कॉलेज में या कॉम्पिटिटिव एग्जाम में। ही डस नॉट हैव द बैकग्राउंड। बिल्कुल। और वो कंपीट नहीं कर पाता। उसके अलावा जो स्कूल चल भी रहे थे। उस पे भी हुरियत साल में 20-200 दिन तक हड़ताल करती थी। हुरियत 48 कैलेंडर निकालती थी और बच्चों के स्कूल बंद रहते थे और बच्चे जो नॉर्मल स्कूल में भी जाते थे, वो भी पढ़ाई नहीं कर पाते थे और इन मास एंड ऑफ द एकेडमिक ईयर इन मास सबको प्रमोट कर दिया जाता था। ठीक है, पांचवीं, छहवीं, आठवीं तक। लेकिन जब 10वीं, 11वीं, 12वीं तक के बच्चे बिना पढ़ाई किए हुए पास होते आ रहे हैं और अभी उसको कंपीट करना पड़ रहा है, ही इज नोव्हेयर। व्हेन ही इज नोव्हेयर, ही डजंट सी एन अपॉर्चुनिटी फॉर फ्यूचर जॉब, फॉर फ्यूचर एजुकेशन, फॉर फ्यूचर लाइफ। एंड ही हैज़ नो बेसिक बैकग्राउंड ऑफ़ एजुकेशन और एनीथिंग। ही इज़ अ राइप कैंडिडेट टू बी कन्वर्टेड टू टेररिज़्म। एंड ऊपर से इस्लामिक रेडिकलाइजेशन वास देयर। सो इट वास अ वेरी विशियस सर्कल इन वर्किंग इन अ वेरी विशियस।\n\nइकोसिस्टम। उस बच्चे के पास कोई चॉइस ही नहीं थी इसके अलावा कि गन उठाएं। गन उठाते ही वो रॉबिनहुड बन जाता था। अपनी लोकैलिटी में गर्लफ्रेंड के सामने। लेकिन एक मैं आपको एक डाटा भी देता हूं। मैंने जब कोर कमांडर बना, मैंने पिछले 2-2.5 साल का डाटा कलेक्ट किया। मैंने कहा मुझे बताइए जो लोकल कश्मीरी लड़के ने गन उठाई है, उसकी शेल्फ लाइफ क्या है? आप हैरान होंगे, आपके दर्शक देख के हैरान होंगे कि जो भी कश्मीरी लड़का, ये 2019-18 के डेटा की बात कर रहा हूं। जो भी कश्मीरी लड़का गन उठाता था, 7% पहले 10 दिन में एनकाउंटर में मारे जाते थे। 17% पहले 3 महीने में। 34% 6 महीने में और 64% पहले 1 साल में। यानी कि एक लड़के ने गन उठाई तो उसकी शेल्फ लाइफ मैक्सिमम अबाउट 1 ईयर। और दूसरा डाटा जो मैंने मदर्स को बताया उनको कन्विंस करने के लिए कि जितने भी लड़कों ने कश्मीर में गन उठाई उनमें से 83%, 83% का स्टोन पेल्टिंग का इतिहास था। दैट मीन्स आज का पत्थरबाज कल का टेररिस्ट परसों की डेड बॉडी। तो एक साइकिल, एक साइकिल जब ये मदर्स को समझाया गया, तो मदर्स की ये बात समझ में आई। और कोई भी मां नहीं चाहती कि उसका बच्चा उससे दूर हो।  फॉर टेररिस्ट और अ सोल्जर और अ कॉमन सिविलियन सिटीजन, मदर इज अ मदर इज अ मदर इज अ मदर। एंड इस्लाम तो बोलता है। कहता है व्हेन यू फीड, यू फर्स्ट फीड द मदर, देन फीड द मदर। देन फीड द मदर एंड देयर आफ्टर फीड द फादर। मदर को जन्नत का रुतबा दिया गया है। तो ऐसी सोसाइटी में इट वाज आई थिंक द राइट। इनिशिएटिव एंड विद अ राइट फ्रेम ऑफ माइंड एंड कन्विंसिंग पीपल द मदर, द ब्रदर्स, द चिल्ड्रन, द पेरेंट्स, द फ्रेंड्स, मौलवी साहब, सरपंचेस, द ओपिनियन मेकर्स। फिर वो काफिला जुड़ता गया। एंड दिस ऑपरेशन बिकेम अ बिग सक्सेस। बिल्कुल और जिस तरह से आपने बताया कि ये ऑपरेशन हमने चलाया आर्मी की ओर से ये चलाया गया ऑपरेशन और बहुत सक्सेस मिला और बहुत सारे युवा जो हैं जो भटक गए थे वो वापस आए और नॉर्मल लाइफ उन्होंने आगे जिए लेकिन जैसे पहलगाम हमला हुआ या उसके बाद हमने देखा आर्टिकल 370 वहां से हटाया गया। उसके बाद आप क्या देखते हैं कि कश्मीर या जम्मू कश्मीर के एडमिनिस्ट्रेशन में या  पॉलिसीज में क्या बदलाव आपने देखे जो कि शायद वहां की जो लोकल पॉपुलेशन है उनके लिए बेनिफिशियल है। वो नहीं जानते कि बेनिफिशियल हैं। आपने पॉलिसी वाइज आपने क्या चेंजेस देखे इन सब घटनाओं के बाद? जब आर्टिकल 370 एब्रोगेशन हुआ बल्कि जब पलवामा हुआ, बालाकोट हुआ, 370 एब्रोगेशन मैं कश्मीर में कोर्ट कमांडर था। यानी कि आई वास इंचार्ज ऑफ ऑल द मिलिट्री इंस्टॉलेशंस एंड मिलिट्री मेन पोस्टेड इन द कश्मीर वैली। चाहे वो लाइन ऑफ कंट्रोल है, चाहे वो कश्मीर वैली है। उन सबका इंचार्ज मैं था और एब्रोगेशन ऑफ आर्टिकल 370। इतना इमोटिव इशू था। इतना इमोटिव इशू था कि अगर छोटी-छोटी बात के ऊपर वहां पर हड़ताल हो जाती थी और लोग सड़कों पर आ जाते थे, गोलियां चल जाती थी। तो आर्टिकल 370 के ऊपर तो लोगों ने सोचा था पता नहीं क्या ही बवाल आ जाएगा कश्मीर में। लेकिन आर्टिकल 370 जब हटा 5 अगस्त 2019 के लेकर 3 महीने बाद तक। जो पीसफुल टाइम था, दैट वाज द मोस्ट पीसफुल टाइम इन द हिस्ट्री ऑफ कश्मीरस टेररिज्म। क्यों? अगर हर कोई सोच पाकिस्तान का पूरा जोर लग गया कि आर्टिकल 370 के बाद में हम किसी तरह से कश्मीर में आग फैला दें, बिल्कुल। फलाने कोई चीफ मिनिस्टर्स हैं उन्होंने बोला कि अगर आर्टिकल 370 को कुछ दिया किया तो कश्मीर में तिरंगे को कंधा देने वाला कोई नहीं होगा। यह भी बात बोलेगी कश्मीर में खून की नदियां बह जाएंगी। नथिंग लाइक दैट हैपेंड। कश्मीर रिमेंड पीसफुल, नॉट अ सिंगल इनोसेंट सिविलियन डाइड एट द हैंड्स ऑफ सिक्योरिटी फोर्सेस इन दोस थ्री मंथ्स। यह इसलिए हुआ कि लोगों ने सोचा कि पिछले 35 साल से बहुत देख लिया है। पाकिस्तान यह करेगा, पाकिस्तान वह करेगा, पाकिस्तान यह करेगा। अभी अगर 370 जा रहा है तो लेट्स ट्राई दिस आल्सो। क्योंकि कॉमन कश्मीरी इज नॉट इंटरेस्टेड इन टेररिज्म, इज नॉट इंटरेस्टेड इन लूजिंग देयर संस। दे आर नॉट इंटरेस्टेड इन लूजिंग देयर प्रॉपर्टी। सो दे सेड ओके लेट्स गिव पीस अ चांस। एंड दैट वाज द मेन रीज़न आवाम ने जब बोला कि हमें पीस लाना है वापस तो पीस आया। एंड वो एक साइकिल है, पीस आएगा तो आपकी रोजमर्रा की जो इनकम है वो बढ़ेगी। जब इनकम बढ़ेगी तो आपके घर में अच्छा खाना बनेगा। अच्छा खाना बढ़ेगा, बच्चे अच्छे स्कूल में जाएंगे, पढ़ाई करेंगे, कोई हिटताल नहीं होगी। कोई माई-बाप नहीं, मां-बाप नहीं चाहता कि मेरा बच्चा आतंकवादी बने या। हर कोई बच्चे मां-बाप चाहते हैं कि मेरा बेटा पढ़े, अच्छा रहे, अच्छे जॉब करे, अच्छी शादी करे।\nअभी वो सपने साकार हो रहे हैं।\nNow the Awam is a stakeholder in peace.\nएंड जैसे आपने जिक्र किया पहलगाम के बाद में फर्स्ट टाइम इन द हिस्ट्री ऑफ कश्मीर, कश्मीरी पीपल केम ऑन द रोड्स।\n\nइन सपोर्ट ऑफ इंडियन गवर्नमेंट अगेंस्ट पाकिस्तान। बिल्कुल। इट हैड नेवर हैपन बिफोर। पहलगाम इंसिडेंट के बाद में ये पहली बार हुआ बिकॉज़ कश्मीरी इज नाउ स्टेकहोल्डर इन पीस। He has seen the dividends of peace. बिलकुल। And वो चीज जो है अभी नॉन रिवर्सिबल है और ये पीस अभी आगे ही आगे जाएगा। और मुझे लगता है इसमें जो डिफरेंसेस हैं पाकिस्तान ऑक्यूपाइड कश्मीर और जो कश्मीर है हमारा। वहां के जो डेवलपमेंट के डिफरेंसेस देख लीजिए आप, हर मामले में जो है भारत का जो कश्मीर है, जो पाकिस्तान ने कब्जे में लिया हुआ है, उसके मुकाबले यहां के लोग मुझे लगता है कि ज्यादा रोजगार के अवसर उन्हें मिलते हैं, खासतौर पर आफ्टर 370 के जो एब्रोगेशन के बाद ज्यादा उन्हें अवसर मिले हैं, आप कैसे इसको कंपैरिजन को कैसे देखते हैं आप? देखिए किसी भी कम्युनिटी को, किसी भी ग्रुप ऑफ पीपल को अगर आपने उनकी आइडेंटिटी खत्म करनी है। तो उनकी लैंग्वेज को खत्म कर दीजिए। जो वर्ल्ड लैंग्वेज डे है जो बांग्लादेश में जब ईस्ट पाकिस्तान था, वहां के लोग बंगाली बोलते थे, बांग्ला बोलते थे। लेकिन वेस्ट पाकिस्तानीज दे वांटेड टू इंपोज पंजाबी एंड उर्दू ऑन देम। दे रिटेलिएटेड एंड वो जो सबसे बड़ा नरसंहार हुआ था उसमें उस दिन के वर्ल्ड लैंग्वेज जे बोलते हैं। सिमिलरली अभी पाकिस्तान ऑक्यूपाइड कश्मीर और इंडियन कश्मीर जब लोग जाते थे वहां पे मुजफ्फराबाद बस में अपने रिश्तेदारों से या दोस्तों से मिलने के लिए वापस जब आते थे। तो मैं वहां पे एज अ मेजर, एज अ कर्नल, एज अ ब्रिगेडियर, एज अ जनरल लोगों से मिलता था जो बोलते थे तौबा तौबा तौबा तौबा। वहां पे जितनी गुरबत है, गुरबत मीन्स जितनी गरीबी है। इसे हम बयान नहीं कर सकते और दूसरी बात जो इम्पोर्टेन्ट उन्होंने बोली कि वहां पे कश्मीरी बोलने वाला कोई रह ही नहीं गया। बच्चे या तो उर्दू बोलते हैं या पंजाबी बोलते हैं। और अभी तो क्योंकि सीपैक शुरू है तो मेंडरिन भी शुरू हो गई है उन वहां के स्कूलों में। तो जिस कौम का आप लैंग्वेज खत्म कर दोगे ना, उस कौम की आइडेंटिटी खत्म हो जाती है। क्योंकि आपके चेहरे पे तो रेखा नहीं है कि आप कौन हैं क्या नहीं। जब आप बोलते हैं तो आपके लहजे से, आपके एक्सेंट से, आपके डायलेक्ट से, आपकी भाषा से पहचान बनती है कि आप उस इलाके के हो, उस स्टेट के हो, उस कंट्री के हो। सो दिस इज अ वेरी सिस्टमैटिक वे ऑफ डिग्रेडिंग कश्मीरीज़ इन पाकिस्तान ऑक्युपाइड कश्मीर। वेयर एस इन इंडियन कश्मीर ईच एंड एवरी पर्सन स्पीक्स कश्मीरी। बिल्कुल। इन एडिशन बिकॉज़ ही इज एजुकेटेड, ही मे बी स्पीकिंग हिंदी, उर्दू, इंग्लिश। बट हिज मदर टंग कश्मीरी इज वेरी मच रेवलेंट एंड इट इज देयर। बिल्कुल। ये जो पाकिस्तान समर्थित आतंकवाद है, आप कैसे जो भारत के हाल ही में लिए गए स्टेप्स हैं, चाहे वो सर्जिकल स्ट्राइक हो, एयर स्ट्राइक हो या फिर हाल ही में लिया गया ऑपरेशन सिंदूर, आप इन स्टेप्स को किस तरह से देखते हैं? पाकिस्तान आतंकवाद जो फैलाता है, उसको कर्व करने के लिए? क्या ये निर्णायक भूमिका आगे भी निभा सकते हैं या फिर लॉन्ग टर्म सलूशन क्या देखते हैं आप इसका? देखिए ऑपरेशन सिंदूर के बाद प्रधानमंत्री श्री नरेंद्र मोदी जी की एक यू नो वीडियो मैसेज था एक। उसमें उन्होंने पूरा जो अपना फ्यूचर का जो काउंटर टेररिज्म स्ट्रेटेजी।\nकरीब-करीब मैंने नहीं देखा इतने बढ़िया तरीके से इतनी बड़ी स्ट्रेटेजी को बयान करना। उसमें उन्होंने बोला था कि टेररिज्म को एक्सेप्ट नहीं किया जाएगा।\nटेररिस्ट और टेररिस्ट को सपोर्ट करने वाले में कोई भी भेदभाव नहीं माना जाएगा।\nटेररिस्ट और टेररिस्ट को सपोर्ट करने वाला चाहे वो स्टेट है उसको भी हम टेररिस्ट ही मानेंगे।\nऔर इंडिया अभी टेररिज्म के खिलाफ कार्रवाई करेगा चाहे वो इंटरनेशनल लेवल पे हो चाहे वो डोमेस्टिक लेवल पे हो। प्रोपेशन सिंदूर उसका एक हिस्सा था, उसका एक मुजाहिरा था, उसका एक नमूना था, उसका एक इंडिकेशन था। सो ये जो सब चीजें हैं टेरर फंडिंग को रोकने के लिए और इंटरनली जो टेररिज्म को सपोर्ट करते हैं चाहे वो ओवरग्राउंड वर्कर्स हैं, चाहे वो टेरर सिंपैथाइजर्स हैं, उनको भी निकाल निकाल के अगर कोई गवर्नमेंट जॉब में बैठा हो उसको भी गवर्नमेंट जॉब से बर्खास्त किया जाए। सो आई थिंक वी आर गोइंग द राइट वे। द मैसेज हैज़ बीन कन्वेयर्ड लाउड एंड क्लियर इन ऑपरेशन सिंदूर एंड दिस इज़ द न्यू नॉर्मल फॉर काउंटर टेररिज़्म ऑपरेशंस। ऑपरेशन सिंदूर पर एक बार फिर से आऊंगा मैं लेकिन इससे पहले बड़ा सिंपल सा क्वेश्चन पूछूंगा। पहले हम देखते थे अक्सर जो है कश्मीर में हड़तालें, पत्थरबाजी की घटनाएं, कश्मीर बंद बुला लिया किसी ने, अब क्यों नहीं होता हो? क्योंकि वो मैंने बोला ना इकोसिस्टम। और इकोसिस्टम की दुकान बंद हो गई।\nपहले ₹500 देके एक बच्चे को बोलते थे जाके पत्थर फेंक के आ और ₹500 लेके आता था, मां जाके दुकान से राशन लाती थी और रात का खाना बनता था।\nअभी वही लड़का जब टूरिस्ट आते हैं या यात्री आते हैं वो सुमो चला रहा है और रात को ₹3000 लेके आ रहा है।\n तो क्यों मां अपने एक बच्चे को भेजेगी पत्थर फेंकने के लिए जिसमें जान का भी खतरा है।\nजबकि पीसफुल तरीके से वो अभी 3000 कमा रहा है, शादी हो रखी है, बच्चे हैं।\nबच्चे स्कूल पहले तो जाते नहीं थे जैसे मैंने आपको बोला, अगर स्कूल जाते भी थे तो हड़ताल 280 ।\n\nदिन अड्डाल। अभी हर रोज स्कूल खुलता है, बच्चे स्कूल जाते हैं और बच्चों का एक भविष्य है। देयर इज अ फ्यूचर। मदर कैन सी द फ्यूचर ऑफ हर चाइल्ड। एंड व्हाई शुड दे गो बैक टू दोस डेज? बिल्कुल। जबकि पहले रात में 5:00 बजे के बाद कोई घर से बाहर नहीं निकलता था। अभी आप देखिए लाल चौक में रात के 11:00-12:00 बजे तक बिल्कुल जैसे इंडिया गेट है, वैसे ही लाल चौक कश्मीर का बिल्कुल एकदम खुशहाली है। सो नोबडी वांट्स टू गो बैक टू दोज़ डेज़। एंड सिंस नोबडी वांट्स टू गो बैक एंड नो टेररिज्म कैन सर्वाइव विदाउट द लोकल सपोर्ट। लोकल स्पॉट होना बहुत जरूरी है किसी भी इंसिडेंसी को सरवाइव करने के लिए। बिल्कुल। दैट लोकल स्पॉट इज नाउ डिमिनिशिंग। एंड जो थोड़े बहुत टेररिस्ट अभी रह भी गए हैं कश्मीर, उनमें से भी 80% पाकिस्तानी हैं। दिस ओनली शोज कि लोकल बॉय इज नॉट इंटरेस्टेड टू जॉइन टेररिज्म।\nएंड वो टेररिस्ट भी गांव में पहले बहुत आते थे खाना लेने के लिए, अभी खाना नहीं लेने आते गांव में।\nउनको मालूम है गांव में जाएंगे तो इंफॉर्मेशन जाएगी।\n\nअभी वो जंगल में रहते हैं, वहीं पे अपनी हाई रोड में।\nऔर जैसे हमने देखा था ऑपरेशन महादेव में। बिलकुल। गांव में नहीं आते क्योंकि गांव के ऊपर उनको भरोसा नहीं है और गांव वाले अभी नहीं चाहते हैं कि आतंकी उनके गांव में आए। दिस इज अ बिग चेंज, बिग चेंज एंड इट्स अ चेंज इन द सोसाइटल वे ऑफ लिविंग। बिलकुल। एंड आई एम वेरी हैप्पी टू सी दिस। हमने देखा था ऑपरेशन सिंदूर पे फिर से आते हैं उसपे देखा कि इलेक्ट्रॉनिक वॉरफेयर या ड्रोन वॉरफेयर हमने देखा किस तरह से पाकिस्तान की ओर से भेजे गए भारत ने मुंह तोड़ जवाब दिया। तो आप कैसे देखते हैं इंसर्जेंसी में ये इलेक्ट्रॉनिक या ड्रोन वॉरफेयर चाहे वो रूस यूक्रेन युद्ध हो, चाहे कोई भी इलाके में युद्ध चल रहा है इस समय। ड्रोन वॉरफेयर बहुत जो है एक की आस्पेक्ट बनकर उभरा है।\nतो आप इसे फ्यूचर इसका फ्यूचर कैसे देखते हैं और भारत को इसके लिए क्या स्टेप्स आगे अपनाने चाहिए।\nउन पर अगर हम बात करें।\nदेखिए टेक्नोलॉजी इज अ इवॉल्विंग फील्ड।\nसो इज डिफेंस टेक्नोलॉजी। एंड जब डिफेंस टेक्नोलॉजी इवॉल्व करती है, डिफेंस वेपन सिस्टम्स इम्प्रूव करते हैं, तो वॉर फाइटिंग जो है उसको भी इवॉल्व होना पड़ता है। यू नो आपकी टैक्टिक्स, आपकी ऑपरेशनल आर्ट, आपकी स्ट्रेटजी दे आल्सो हैव टू इवॉल्व। नाउ, हू कुड हैव इमेजिन फ्यू इयर्स अगो कि टू न्यूक्लियर पार्ट्स फर्स्ट टाइम इन द हिस्ट्री ऑफ द वर्ल्ड कम टू अ स्टेज वेयर दे आर एंगेज्ड इन अ वॉर विद ईच अदर। फर्स्ट टाइम इन द हिस्ट्री टू न्यूक्लियर पावर्स केम टू अ वॉर। एंड फॉर द फोर डेज ऑफ द वॉर, नॉट अ सिंगल कॉम्पिटेंट सोल्जर और नॉट अ सिंगल कॉम्पिटेंट इक्विपमेंट क्रॉस द इंटरनेशनल बाउंड्री और लाइन ऑफ कंट्रोल। सारी लड़ाई जो है, हवा में और ड्रोन्स के हिसाब से हुई। लॉन्ग रेंज वेपन सिस्टम के साथ हुई, इलेक्ट्रॉनिक वॉरफेयर के साथ हुई। लेकिन एक भी ना कोई टैंक, ना कोई तोप, ना कोई जवान। हमारी तरफ से क्रॉस किया ना उनकी तरफ से भी क्रॉस किया, कोई हमला नहीं हुआ।\nSo this is a new phase of warfare.\nAnd if this is a new phase of conventional warfare,\nसिमिलरली द कन्वेंशनल वॉरफेयर  हैज़ अ इफेक्ट ऑन द नॉन कन्वेंशनल वॉरफेयर।\nतो ड्रोन्स जो है काउंटर टेररिज्म ऑपरेशन में भी इस्तेमाल होंगे। दुनिया में हो रहे हैं।\nहमारे जम्मू कश्मीर में भी और जहां पे इंसिडेंसी है वहां पे ड्रोन का इस्तेमाल चाहे वो सर्विलांस के लिए है, चाहे वो इंफॉर्मेशन के लिए है, चाहे वो लॉजिस्टिक्स के लिए है।\nचाहे वो इनफैक्ट आर्म ड्रोन आर आल्सो पार्ट ऑफ द आर्म एरीना।\nसो एनी कंट्री व्हिच डिसाइड्स टू यूज आर्म ड्रोन अगेंस्ट इट्स ओन सिटीजंस। दे आर यूजिंग इट। इंडिया इज नॉट यूजिंग, इंडिया हैज़ नेवर यूज्ड हैवी वेपनरी अगेंस्ट काउंटर टेररिस्ट ऑपरेशन। अगर दुश्मन टेररिस्ट के पास एलएमजी है तो हम भी एलएमजी यूज करते हैं। टेररिस्ट के पास रॉकेट लांचर है तो हम भी रॉकेट लांचर यूज करते हैं। हमने कभी भी हैवी वेपनरी इंडिया में यूज़ नहीं की जब कि पाकिस्तान तो वहां पे गन शिप्स, एयरक्राफ्ट्स, हेलीकॉप्टर्स, आर्टिलरी यूज़ करता है टेररिस्ट के खिलाफ और उनके टेररिस्ट के खिलाफ। बिल्कुल। सो वी हैव अ वेरी वेरी  उचिस्तान में देखा किस तरह से होता है या फिर जो नए-नए आतंकी गुट जो है लगातार हमला करते हैं उनको कब करने के लिए कितना डीइम्यूनाइज वे में वो करते हैं।  एमरन मिसाइल है जो F16 पे फिट होती है।  दैट इज गिवन टू पाकिस्तान ओनली ऑन द प्रमाइस कि इट विल नॉट बी यूज्ड इन कन्वेंशनल वॉरफेयर। इट विल ओनली बी यूज्ड फॉर  काउंटर टेरर ऑपरेशंस। सो, आवर वे ऑफ वॉर फाइटिंग इज डिफरेंट, आवर इथोड्स आर डिफरेंट, आवर कल्चर आर डिफरेंट। आई ऑलवेज से 5000 साल पुरानी सभ्यता के वंशज हैं हम। ना, आवर एथिकल बिहेवियर इज डिफरेंट। बिल्कुल और उसी बिहेवियर का एक ऊपर जो है हम ऑपरेशन मां को देख सकते हैं। बिल्कुल। सी, ऑपरेशन मां जो है ना एक इज अ वेरी इमोशनल सब्जेक्ट एंड टॉपिक। एंड जैसे आपने पहले सवाल में एक पूछा था कि कैसे आपको फील हुआ।\nमैं कुछ मदर से मिला हूं जिनके बच्चे वापस आए।\n एंड आई स्टिल रिमेंबर इन बारामुल्ला अ पर्टिकुलर मदर।\nजैसे मैं उनको मिला तो उन्होंने पहले तो जैसे होता है कि बहुत अच्छा हुआ आंखों में आंसू आ रहे हैं, रो भी रहे हैं।\nफिर देन शी हेल्ड माय हैंड।\n\nएंड शी हेल्ड माय हैंड एंड शी किस्ड माय हैंड, बोसा बोलते हैं उसको। जो आपके बहुत नजदीक हो जिसने आपके लिए बहुत कुछ किया ना उसको फिर आप समथिंग लाइक दिस। तो उन्होंने मेरा हाथ करीब 2 मिनट पकड़ के रखा एंड शी केप्ट लुकिंग इंटू माय आइज। एंड सेइंग प्रोबेबली नथिंग बट कन्वेइंग के इफ यू आर द वन हु गॉट माय सन बैक। और एक मां के लिए कितनी बड़ी बात है कि उसका बच्चा फ्रॉम अ कंफर्म डेथ ही कम्स बैक टू हर। एंड आज वो बच्चा अपनी मां के साथ खुशहाल है। पूरा परिवार खुशी से रह रहा है, शादी वादी किया हुआ है। इस ऑपरेशन मां जो डॉक्यूमेंट्री है, इसमें भी जो एक्चुअल लड़के जिन्होंने गन उठाई थी, उनकी स्टोरी है। कैसे उन्होंने गन उठाई, क्यों गन उठाई, क्या हुआ उनके साथ जब वो टेररिज्म टेररिस्ट के साथ चल रहे थे? और कैसे उनकी मदर्स ने या उन्होंने वापस आने की कोशिश की और कैसे सिक्योरिटी फोर्सेस ने उनको हेल्प किया? कैसे वो आज जो जिंदगी जी रहे हैं, क्या नतीजा लेकर आए हैं वापस? मुझे लगता है कि जो पाकिस्तान की ओर से प्रोपेगेंडा फैलाया जाता है कि कश्मीर में आर्मी जो है क्रुएलिटी करती है, जो भी करती है जो प्रोपेगेंडा उनका है। ऑपरेशन मां उसका एक माकूल जवाब है और इस तरह की डॉक्यूमेंट्री से ये पूरी दुनिया आई गेस ये देखे कि किस तरह से जो है एक ह्यूमनाइज्ड वे में अगर कोई गलत रास्ते पर चल भी गया है उसे वापस कैसे लाया जाए। ये एक बिल्कुल मिसाल के तौर पर पेश होना चाहिए। सी, ऑपरेशन मां जो है, मतलब इट्स वन ऑफ द पीस इनिशिएटिव्स। लाइक एज अ कोर कमांडर, मेरा जो काउंटर टेररिज्म या हार्ड ऑपरेशंस थे ना, दैट वाज ओनली 10% ऑफ माय जॉब। 90% ऑफ़ माय जॉब वास कि कंसोलिडेट द पीस व्हिच हैज़ बीन अचीव्ड। हेल्प इन नेशन बिल्डिंग, हेल्प इन स्टेट्स इकॉनमी बिल्डिंग, हेल्प इन स्टेट्स पीस। एंड मेक श्योर द यंग बॉयज़ डू नॉट गो बैक टू द सेम रूट अगेन। एजुकेशन सिस्टम इम्प्रूव करो, हेल्थ सिस्टम इम्प्रूव करो। यू नो, सैनिटेशन इम्प्रूव करो। बच्चों की बेसिक अवेयरनेस इम्प्रूव करो। क्लीनीनेस ऑफ़ द एरिया, जॉब क्रिएशन। सो ये सब चीजें जो हैं, वेदर गवर्नमेंट इज डूइंग अ लॉट। इस चीज की तरफ 90% ध्यान रहता है। बिल्कुल। और बाकी 10% तो हार्ड ऑपरेशंस विल कंटिन्यू। वो भी जरूरी है क्योंकि पाकिस्तानी टेररिस्ट अगर इनफिल्ट्रेट करते हैं तो उनको भगाना बहुत जरूरी है। पाकिस्तान के जो जिहादी जनरल हैं, असीम मुनीर, अमेरिका में जा के परमाणु धमकियां देते हैं भारत को, आप इन धमकियों को कैसे देखते हो? क्या इंडिया को इन धमकियों को सीरियसली लेना चाहिए? देखिए जो आसिफ मनीर ने जो पाकिस्तान के अभी फील्ड मार्शल अपने को बना दिया है। तो जब एक अमेरिका जैसे देश की धरती पर जाके जो कि एक डेमोक्रेसी है। वहां से एक वो स्टेटमेंट देते हैं कि मैं न्यूक्लियर वेपन से आधे दुनिया को तबाह कर दूंगा। अशी मोस्ट इररिस्पोंसिबल स्टेटमेंट बाय एनी ऑफिशियल ऑफ अ न्यूक्लियर पावर स्टेट। मोस्ट इररिस्पोंसिबल एंड अनफॉर्चूनेट पार्ट इज जहां तो वो होस्ट कंट्री और होम कंट्री की परमिशन के साथ ये स्टेटमेंट दी जाती है। आई हैव बीन अ वेरी सीनियर आर्मी ऑफिसर। यू जस्ट कांट गो एंड मेक अ स्टेटमेंट लाइक दिस। जहां अगर मान लो कि उन्होंने बोल भी दिया तो होम कंट्री या होस्ट कंट्री उसको बाद में स्नब करती है, रिबट करती है, कंडेम करती है। ऐसा कुछ भी नहीं हुआ है। दैट मीन्स इट इज एक्सेप्टेड ऑन अ डेमोक्रेसी सोइल टू गेट अप एंड यू नो गिव अ स्टेटमेंट कि आई विल यूज न्यूक्लियर वेपन्स एंड डिस्ट्रॉय हाफ द वर्ल्ड। दैट इज वन पार्ट, व्हाट्स बस इररिस्पोंसिबल से।\nसेकंड पार्टी सेज अगर आपने पानी रोका, आपने डैम बनाए तो मैं मिसाइल से डैम तबाह करता हूं।\nअभी ये जो मिसाइल्स जिसकी वो बात कर रहे हैं, ऑपरेशन संदूर में भी उन्होंने यही मिसाइल चलाई थी।\nउनमें से एक भी मिसाइल टारगेट पे हिट नहीं किए।\nऔर हमारी मिसाइल्स चाहे वो टेरर टारगेट थे। चाहे वो उनके एयर बेसिस थे, 100% प्रेसिजन हिट्स थे। बिल्कुल। अगर वो ये कह रहा है कि मैं मिसाइल चला के आपका डैम को तबाह कर दूंगा, तो हमें नहीं मालूम कि मंगला डैम कहां पे है, हमें नहीं मालूम मराला हेडवर्क कहां पे है, हमें नहीं मालूम गुड्डू बैराज कहां पे है, हमें नहीं मालूम सकर बैराज कहां पे है। और हमारी मिसाइल्स तो बिल्कुल प्रसाइज आती हैं। बिल्कुल। आपकी पहुंच भी नहीं पाई और हमने हिट भी किया, सब वो भी दिखाए। यू कुंट, यू कुंट स्टॉप इट। बिल्कुल। एंड अगर मतलब यह एक ऐसी मिलिट्री है जिसने इतिहास में एक भी जंग नहीं जीती। यह एक ऐसी मिलिट्री है पाकिस्तान आर्मी जिन्होंने वर्ल्ड वॉर 2 के बाद वर्ल्ड कप बिगेस्ट सरेंडर 93000 स्टैंडिंग आर्मी, नेवी, एयरफोर्स सरेंडर किया। मैं कैप्चर की बात नहीं कर रहा हूं। लड़ते हुए कैप्चर हो जाएं अलग बात है। सरेंडर जब कि आपके पास हथियार, एमुनिशन सब कुछ है। थाउजेंड्स ऑफ़ सोल्जर्स। 93000 एंड फिर वो हमारे यहां रहे सालों तक। स्कोच भी पी, गोल्फ भी खेला। और वो आर्मी बोलती है कि मैं न्यूक्लियर बम चला दूंगा। न्यूक्लियर वेपन इज नॉट अ वेपन ऑफ वॉर, न्यूक्लियर वेपन इज अ वेपन ऑफ थ्रेटन बीइंग। नो रिस्पांसिबल नेशन।\n\nविल से कि मैं हाफ द वर्ल्ड आई विल डिस्ट्रॉय।\nआई थिंक दिस इज अ मोस्ट इर्रेस्पोंसिबल स्टेटमेंट एंड प्रोबेबली डजंट इवन नो न्यूक्लियर वेपन्स क्या होते हैं।\nसो  ये जो आपने 90 प्लस थाउजेंड की सोल्जर्स की बात की एक आउट ऑफ द टॉपिक एक सवाल आपसे पूछूंगा आपको क्या लगता है कि जो शिमला समझौता हुआ था वो थोड़ा  इजी टर्म्स पे जो है समझौता हो गया जब हमारे पास इतना बड़ा लेवरेज था। कश्मीर समस्या का हल नहीं हो सकता। चाहे हाजीपीर 1965 में हाजीपीर पास हमने कैप्चर किया। चाहे हाजीपीर को वापस देना इट वाज अ वेरी स्ट्रेटेजिक पास, इट्स नॉट अ टैक्टिकल पास। इट्स अ स्ट्रेटेजिक पास। तो गिव इट बैक, आई थिंक व्हाट द बिगेस्ट मिस्टेक एंड शिमला समझौते में हमारे पास हमारा जो 54 प्रिजनर्स ऑफ वॉर पाकिस्तान के पास है। हमने ₹93000 वापस कर दिए, वी कुडंट इवन यू नो नेगोशिएट फॉर दोज़ 54। एंड देयर वास सच अ बिग लिवरेज ऑफ 93000 पीपल वी कुड हैव नेगोशिएटेड फॉर मच मोर परमानेंट सॉल्यूशन ऑफ कश्मीर पीओके टू बी रिटर्न। स्काई इज द लिमिट व्हेन यू हैव सच अ बिग लिवरेज। बट एनीवे, एक शेर है ना कि लम्हों ने खता की, सदियों ने सजा पाई। सो दैट इज व्हाट हैपन्स। अभी हमने जिक्र किया कि जो जनरल हैं उन्हें फील्ड मार्शल खुद को उन्होंने दिया या अब सरकार ने दिया, ये तो डिबेटेबल है। लेकिन इससे पहले ऑपरेशन सिंदूर से पहले जितने भी ऑपरेशन हुए, हमने देखा कि कहीं ना कहीं पाकिस्तान नैरेटिव में कहीं ना कहीं आगे रहता था। अपनी आवाम को समझाना हो या फिर जो भारत में भी हमने देखा कि किस तरह से सर्जिकल स्ट्राइक के सबूत मांगे गए, एयर स्ट्राइक के सबूत मांगे गए। लेकिन इस बार एक नैरेटिव में भी चेंज आया सरकार की ओर से कि सबूत भी दिखाए हमने। हमने नहीं दिखाए जो पाकिस्तान से ही वीडियो वायरल आने लगे होने लगे और भारत के जो भी प्रतिनिधित्व जो वो थे डेलीगेट्स थे वो पूरी दुनिया में गए ऑपरेशन सिदूर के बारे में बताया तो आप एक शिफ्ट देखते हैं नैरेटिव बिल्ड करने में ये बहुत एक इंपॉर्टेंट पार्ट ऑफ वॉर है। देखिए। इसमें ना एक बहुत बड़ा जो चीज़ है नैरेटिव बिल्डिंग में, उसमें इंडिया इज़ अ वाइब्रेंट डेमोक्रेसी।  एंड वी अलाउ डिसेंट, वी अलाउ रिसेंटमेंट, वी अलाउ पीपल आस्किंग क्वेश्चन टू द गवर्नमेंट। दैट इज द बेसिस ऑफ दी, दैट इज द बेसिस। डेमोक्रेसी में ये सब कुछ जायज है। अभी जो सवाल पूछने वाला है वो सही सवाल पूछता है, नहीं पूछता, किस मंशा से पूछता है, वो सेपरेट इशू है। पाकिस्तान में कहने को डेमोक्रेसी है, शेम डेमोक्रेसी है। दैट्स व्हाई वहां पे कोई सवाल पूछने की हिम्मत भी नहीं करता है। जबकि उनके सामने हैं बहावलपुर, मरीद के से लेकर कोटली और ऊपर मुजफ्फराबाद तक पूरे टारगेट डिस्ट्रॉयड हैं। उनके सामने हैं उनके 11 एयर बेसेस डिस्ट्रॉयड हैं। प्राइम मिनिस्टर खुद कह रहे हैं कि नूरखां पे और मजाइले गिरी हैं। लोकल उनके जो वीडियो बना बना के ये भावरपुर का वीडियो, ये नूर खान का वीडियो। वो सब कुछ दिख रहा है पब्लिक को लेकिन फिर भी वो सवाल नहीं पूछ सकते। क्योंकि पाकिस्तान में डेमोक्रेसी नहीं डिक्टेटरशिप है। और उनको जो है फील्ड मार्शल उनको जो भी नैरेटिव दिया जाता है पाकिस्तानी सिर्फ वही बोलेगा चाहे सोशल मीडिया चाहे अदरवाइज। सो दैट्स अ सटल डिफरेंस इन बीइंग अ वर्ल्ड्स बिग्गेस्ट डेमोक्रेसी एंड बीइंग अ वर्ल्ड्स बिग्गेस्ट टेररिस्ट एंड न्यूक्लियर स्टेट। वहां पे जुबान खोलने की आपको हिम्मत नहीं है और यही चीज जो है यू नो ये जो सेंटीमेंट्स हैं ये ऑपरेशन मां में भी जाहिर होते हैं। क्योंकि हमारी पब्लिक को हम अपना समझते हैं। वो बच्चा हमारा है, उस बच्चे की मां जो उसको वापस लाने की कोशिश कर रही है। शी इज एन इंडियन सिटीजन, वी केयर फॉर आवर सिटीजन्स। पाकिस्तान डजंट हैव एनीथिंग लाइक दिस, पाकिस्तान ने तो अपने सोल्जर्स की डेड बॉडी वापस नहीं ली थी। कारगिल में बिल्कुल। जब मैं कोर कमांडर था, पांच पाकिस्तानी टेररिस्ट लाइन ऑफ कंट्रोल के ऊपर हमने मारे। उनको मैसेज दिया कि इनकी बॉडी ले जाइए, नहीं ले के गए। कुत्तों ने खाई वो बॉडी वहां पे। वो वापस नहीं ले के गए। वी केयर फॉर लाइक अगेन कम बैक। 5000 साल पुरानी सभ्यता के वंशज हैं। हमारा कल्चर, हमारे इथों से हमारा वे ऑफ़ वर्किंग इज़ डिफरेंट। ये तो कौन पाकिस्तान में मुझे बताओ एक भी किसी टेररिस्ट की मां को बोला हो कि मैं तेरे बच्चे को वापस लाता हूं। बिलकुल नहीं। और ये सारी वीडियोस हमने सोशल मीडिया पर देखी भी हैं। कश्मीर में जब ऑपरेशन होता है और आर्मी जो है एक एक घर हाइड आउट में अगर आतंकवादी हैं, तो हमने देखा है किस तरह से जो मां-बाप हैं वो अपील कर रहे होते हैं उनसे कि वापस आ जाओ और जिस तरह से आपने जिक्र किया कि कितने सारे जो लड़के हैं।  वो गलत राह पर थे और वापस आए और कहीं ना कहीं एक फिर से कहूंगा ये मिसाल है ये आपने खुद जिक्र किया कि वर्ल्ड में अपनी तरह का पहला ऑपरेशन था और मुझे लगता है कि पूरी दुनिया को इसके बारे में जानना चाहिए और दुनिया भर में अगर कहीं इस तरह की इंसर्जेंसीज हैं तो यूज होना चाहिए इसको।\nसही बात कह रहे हैं।\nऐसा भी टाइम आए थे जब  ऑपरेशन चल रहा है, एक लोकल कश्मीरी लड़का अंदर फंसा हुआ है।  एनकाउंटर इज ऑन। उसके मां को, बाप को या भाई को या वहां से गांव से लेके आते हैं। उससे बात करवाते हैं मोबाइल के ऊपर और इसी दौरान लड़के का मोबाइल का रिचार्ज खत्म हो जाता है। हम अपनी पॉकेट से उसका\n\nरिचार्ज करवाते हैं ऑनलाइन ताकि उसकी बातचीत अपनी मां के साथ जारी रहे और ये आपको कहीं देखने को नहीं मिलेगा। ये नहीं मिलेगा देखने को और वो लड़का बचता है, वापस आता है, अपनी मां से मिलता है, पेरेंट्स से मिलता है। तो ये एक मिसाल है जहां पे वी वी हैव अ सॉफ्ट कॉर्नर फॉर आवर सिटीजन। बिकॉज़ वी आर पार्ट ऑफ द सोसाइटी। पाकिस्तान में क्या है एक बार आर्मी ऑफिसर बन गया तो ही बिकम्स यू नो समथिंग बिग। वी आर सेम सोसाइटी, वी कम फ्रॉम द सेम सोसाइटी आफ्टर रिटायरमेंट, वी गो बैक टू द सेम सोसाइटी। यह एक फर्क है।\nवहां पे एवरीथिंग इज बेस्ड ऑन यू नो कॉर्नर प्लॉट्स एंड पिज़्ज़ा चेन्स।\nइंडिया में वो नहीं है।\nहाल ही में ट्रंप प्रशासन की जिस तरह से मैंने जिक्र किया कि कैसे जो जनरल है वो जाता है वहां पर और पूरी दुनिया को तबाह करने की धमकी देता है। क्रम प्रशासन का नर्म रुख जो हाल ही के कुछ समय में आया है, आप इसको कैसे देखते हैं? क्या भारत के लिए एक अच्छा संकेत नहीं है ये? देखिए जो पाकिस्तान की जियोस्ट्रेटेजिक लोकेशन है। वो बहुत इम्पोर्टेन्ट है और पाकिस्तान आर्मी इसको समझती है। पॉलिटिशियंस को समझ आए नहीं आए अलग बात है, पाकिस्तान आर्मी समझती है। अब देखिए पाकिस्तान की लोकेशन है, साउथ में अरेबियन सी है और इंडियन ओशन है। एनी नेवल स्पॉट और ए नेवल अमाडा व्हिच हैज़ टू कम कैन हिट पाकिस्तान कोस्ट। उसके साउथ वेस्ट में आप देखेंगे तो अरेबियन सी अपना पर्शियन गल्फ है, स्ट्रेट ऑफ़ होरमुज़ है। दुनिया का पूरा एनर्जी का बेसिन है वो। पूरी वहां से जितनी भी सप्लाई चल रही है, जितनी भी ट्रैफिक है, जितने भी शिप्स हैं, उसके ऊपर बैठा हुआ है। ग्वादर पोर्ट जो चाइना के पास है, दैट्स द मोस्ट स्ट्रेटेजिक पोर्ट इन दैट एरिया। उसके देखिए उसके वेस्ट में ईरान है। कल को ईरान के खिलाफ कोई भी कार्यवाही करनी है, पाकिस्तान की जमीन, उनके एयर बेसेस, उनकी स्पेस चाहिए। बिल्कुल। और यही जरूरत थी जब अमेरिका ने ईरान पे न्यूक्लियर बॉम्ब्स न्यूक्लियर के खिलाफ कार्रवाई की बी टू बॉम्बिंग करके। दैट टाइम आल्सो पाकिस्तान वाज कंसील्ड एज एन ऑप्शन टू अटैक ईरान फ्रॉम द ईस्ट। ऊपर चले जाओ तो अफगानिस्तान है, अनफिनिश्ड एजेंडा। अगर अफगानिस्तान में फिर से कोई कार्यवाही करनी पड़ती है तो पाकिस्तान की ज़रूरत है। उसके ऊपर चाइना, ईस्ट में इंडिया। इंडिया चाइना के खिलाफ फिर लॉन्ग टर्म कोई प्रॉब्लम आती है तो वेस्ट नीड्स पाकिस्तान। तो पाकिस्तान ऐसी लोकेशन है कि उसकी ज़रूरत उनको पड़ेगी ही पड़ेगी। और पाकिस्तान नोज इट और पाकिस्तान इसका फुल फायदा उठाता है। और इसलिए पाकिस्तान को हम अगर सोचे कि हमारे कहने पे कोई पाकिस्तान से साथ छोड़ देगा, नहीं। दुनिया में सिर्फ पर्सनल इंटरेस्ट होते हैं हर किसी के। दूसरे के लिए कोई कुछ नहीं करता। हमें अपने लिए खुद करना पड़ेगा जैसे हमने ऑपरेशन संदूर भी किया। और क्योंकि हम दुनिया की बिगेस्ट डेमोक्रेसी हैं, फोर्थ लार्जेस्ट इकॉनमी हैं, मिलिट्री माइट हैं। तो जब हम करते हैं कुछ देन नो वन क्वेश्चन अस। अगर यही काम हमने किया होता, हम कहीं 150th इकॉनमी होते और लोगों ने हमें करने ही नहीं देना था। दिस वर्ल्ड ओनली अंडरस्टैंड्स स्ट्रेंथ। दैट इज द मेन थिंग। लेकिन देखिए डोनाल्ड ट्रम्प ने कहीं ना कहीं समर्थन दिया। आसिम मुनीर को, आसिम मुनीर मतलब पाकिस्तान आर्मी। पाकिस्तान आर्मी जिसका लिंक सीधा-सीधा आतंकवादियों से है। तो भारत के लिए सुरक्षा के लिहाज से एक बहुत खतरनाक सिचुएशन बन जाती है। देखिए जो भी सिचुएशन डेवलप होगी, हमें उसका मुकाबला खुद करना है, हमें किसी के सहारे की उम्मीद नहीं रखनी चाहिए। वी हैव टू फाइट आवर ओन बैटल्स, नोबडी इज गोइंग टू कम एंड फाइट ओवर बैटल। द ओनली आंसर इज टू डेवलप इकोनॉमिकली, डेवलप मिलिटरली एंड हैव स्ट्रांग पॉलिटिकल विल। अगर ये तीन चीज़ नहीं है, तो हमारी डिप्लोमेसी भी वीक होगी, हमारी इकॉनमी भी वीक होगी, हमारी मिलिट्री भी वीक होगी, हमारी गवर्नमेंट भी वीक होगी। देन वी कैन नॉट फेस द वर्ल्ड। वी नीड टू लुक इनवर्ड्स एंड स्ट्रेंथन आवरसेल्व्स। उसके बाद वी कैन फेस द अवेल, देन देयर इज नो प्रॉब्लम। पाकिस्तान अगर मैं बात करूं जो तनाव है इस समय भारत और पाकिस्तान के बीच में। ये तनाव को लेकर अमेरिका के जो विदेश मंत्री हैं मार्को रूबी उनका कहना है कि ये जो सीज फायर है ये सस्टेन सस्टेनेबल नहीं है, लंबे समय तक नहीं टिक पाएगा। क्या भारत पाकिस्तान में इस तरह का कॉन्फ्लिक्ट आगे भी हो सकता है? देखिए जो रूबियो कह रहे हैं कि सीस फायर लंबे समय तक नहीं टिक पाएगा। उसके लिए उनकी जो नॉलेज ऑफ ये लड़ाई हुई क्यों? ये लड़ाई हुई क्योंकि पाकिस्तान ने पहलगाम में आतंकी हमला किया। और अगर वो सोचते हैं कि शीश फायर नहीं टिक पाएगा तो अगर पाकिस्तान दोबारा ऐसी हरकत करता है और इंडिया ने तो डिक्लेअर किया कि वी विल रिएक्ट। अगर पाकिस्तान दोबारा कोई टेररिस्ट की टेररिज्म की हरकत करता है तो इंडिया विल रिएक्ट बैक। दैट कैन बी कॉल्ड कि शीशफाई नहीं टिकराए। सो द वे यू सी इट। कश्मीर पर एक आखिरी सवाल मैं पूछना चाहूंगा कि भारत को कश्मीर में शांति स्थापना के लिए भारत ने बहुत सारे भारत सरकार ने बहुत सारे कदम उठाए हैं। आपको क्या लगता है पॉलिसी में और क्या एडिशंस किए जा सकते हैं?\n\nसकते हैं ताकि कश्मीर में एक फाइनल सॉल्यूशन जो है शांति का वो दिया जा सके। एनीवेयर इन द वर्ल्ड टेररिज्म या इंसिडेंसी हैज़ नेवर बीन पुट डाउन बाय द गन। द मिलिट्री और द गन कैन ओनली ब्रिंग इट डाउन टू अ लेवल वेयर द नेगोशिएशंस कैन हैपन एंड पीपल कैन कम एंड स्टार्ट टॉकिंग। अल्टीमेटली इट इज द इकोनॉमिक्स व्हिच ड्राइव्स द पीस। अगर इकोनॉमिक्स सही है, अगर वहां पे कश्मीर के हर घर में शाम को अच्छा खाना बनता है, अच्छी नौकरी है, अच्छी एजुकेशन है, अच्छी हेल्थ सिस्टम्स हैं, देन व्हाई वुड एनीवन पिक अप अ गन? बिल्कुल। क्योंकि वो चीज नहीं थी और इसलिए वो बॉयज कुड बी रेडिकलाइज्ड एंड यू नो टेकन टू डिफरेंट साइड। अभी जब मेन जो एम्फेसिस है वो इन बेसिक नीड्स पे होना चाहिए, एजुकेशन सिस्टम को इम्प्रूव करो। हेल्थ सैनिटेशन उसको इम्प्रूव करो, जॉब क्रिएशन एंड हायर एजुकेशन। वंस दीज़ थिंग्स हैपन, द प्रॉब्लम विल गेट रिसोल्वड ऑन इट्स ओन बिकॉज़ इट्स अ साइकिल। एंड ये हो रहा है। आज की तारीख पे जितनी भी फ्लाइट्स जा रही थी बिफोर पेलगाम, दे आर गोइंग 100% फुल। होटल ऑक्यूपेंसी वाज 100%। एटीएम कैश डिस्पेंसेशन वाज ट्रमेंडस। और यही पाकिस्तान को हजम नहीं हुई। यही पाकिस्तान को हजम नहीं हो रहा था। क्योंकि वहां पे तो जैसे मैं पहले बोला गुरबत है वहां तो। वहां तो हुकुमतान बोल रहे हैं कि एक टाइम का खाना बंद कर दो। पाकिस्तान के रुपए का डॉलर के अगेंस्ट देखिए वैल्यू क्या है आज। उनके वहां पे दालचीनी, सब्जी, पेट्रोल, डीजल उसकी कीमतें देखिए। बिजली के बिल देखिए उनके। तो इट्स गुड थिंग दैट वी आर इन अ इंटरनेट सोसाइटेशन एज नाउ। एटलीस्ट यू कम टू नो एक दूसरे देश में क्या हो रहा है। और हम ये भी देखते हैं कि पाकिस्तान ऑक्यूपाइड कश्मीर में लगातार जो है प्रोटेस्ट होते रहते हैं। और इन प्रोटेस्ट को देख के ऐसा लगता है कि पीओके के जो लोग हैं, वो भी कहीं ना कहीं चाहते होंगे कि पीओके के लोग आर जस्ट नॉट हैप्पी विद पाकिस्तानी, पंजाबी, मुसलमान। Pakistani Society is dominated by Punjabi Pakistani Muslim. And no POK citizen that is Kashmiri wants them. No Gilgit Baltistan citizen wants them. दैट्स व्हाई दी प्रोटेस्ट आर देयर। दे वांट टू मेंटेन देयर इंडिविजुअल आइडेंटिटी। एंड वो जब देखते हैं कि इंडिया में इतनी तरक्की हो रही है, हमारे यहां पे इतनी गरीबी है। सो दिस प्रोटेस्ट इज नेचुरल। नियर फ्यूचर में आप पीओके को भारत में मिलता देख रहे हैं। क्योंकि हर चीज का एक समय होता है। तो जब वो समय आएगा तो जरूर और इट्स अ इट्स अ डिक्लेरेशन ऑफ आवर पार्लियामेंट। हमारे पार्लियामेंट का रेजोल्यूशन है। पीओके इज पार्ट ऑफ इंडिया एंड वी विल टेक इट बैक। वी विल टेक इट बैक। अच्छा हमारी ऑडियंस को ऑपरेशन मां क्यों देखनी चाहिए एक बार दर्शकों को आप डायरेक्ट प्रेशिप क्या देना चाहेंगे? देखिए हम एक ऐसे एरिया से या ऐसे सबकॉन्टिनेंट में रहते हैं जहां पे फैमिली वैल्यूज का बहुत महत्व है। हमारे परिवार में लोग आपने देखा होगा ये बोलते हैं कि तेरे दादाजी तो गांव के सरपंच थे, नंबरदार थे, तू ये कैसे कर रहा है? वी हैव टू लिव अप टू द एक्सपेक्टेशंस ऑफ द सोसाइटी, द फैमिली नॉर्म्स एंड दैट इज एक्जेक्टली व्हाट ऑपरेशन मां इज ऑल अबाउट। ऑपरेशन मां टेल्स यू बाहर घर के किसी का भी नेम प्लेट पे बोर्ड पे नाम लिखा हो। घर के अंदर मां डिसाइड करती है कि आज खाने में क्या बनेगा, बच्चा कौन से स्कूल में जाएगा, बच्चा क्या कपड़े पहनेगा, कैसे घर चलेगा। सो मदर इज अ वेरी सेंट्रल फिगर इन आवर सोसाइटी। एवरी सोसाइटी मादर रोल इज वेरी इंपोर्टेंट, बट इन आवर सोसाइटी इट इज एब्सोल्युटली इंपोर्टेंट बिकॉज़ वी हैव अ वेरी क्लोज निट सोसाइटी, क्लोज निट फैमिली वैल्यूज।\nहम तो पूरे विश्व को एक कुटुंब मानते हैं।\nएंड दैट इज द रीज़न एंड दैट वाज द थीम ऑफ ऑपरेशन मां टू यू नो टेक द थिंग वेयर इट बिलोंग्स। एक लड़का है वो अपनी मदर के पास ही बिलोंग करता है, उसको वापस अपनी मदर के पास जाना है, जाना चाहिए। नो सन शुड बी विदाउट अ मदर एंड नो मदर शुड बी विदाउट अ सन। दैट वाज द बेसिक थीम ऑफ़ ऑपरेशन माँ। एंड प्लीज वॉच दिस डॉक्यूमेंट्री। इट्स अ वेरी वेल मेड डॉक्यूमेंट्री। आई कैन वाउ फॉर इट। व्हाइल सीइंग इट, आई हैड गुजबॉन्स। एंड आई एम श्योर यू विल एन्जॉय इट। इट्स रिलीजिंग इन ऑन डोकुबे ऑन 27th ऑफ़ अगस्त। मार्क द डेट एंड व्हेन आई विल गेट टाइम प्लीज वॉच दिस डॉक्यूमेंट्री, मेक श्योर योर चिल्ड्रन वॉच दिस डॉक्यूमेंट्री। इट्स एन एक्सेप्शनल पीस ऑफ़ आर्ट। ऑल द वेरी बेस्ट।\nथैंक यू।\nजय हिंद।\nथैंक यू सो मच फॉर जॉइनिंग  टीवी9 भारतवर्ष में आया आपने समय दिया और बिल्कुल जिस तरह से ढिल्लों साहब ने कहा कि आप 27th अगस्त को डॉक्यू वे पे ये डॉक्यूमेंट्री बिल्कुल जरूर देखें और खबरों के लिए आप टीवी9 भारतवर्ष देखते रहिए।\nधन्यवाद।\nथैंक यू एंड जय हिंद।	\N	2025-11-27 04:31:28.635864	processing	t	2025-11-27 04:31:44.674082
28	admin@gmail.com	Hindi_Sample_1 - Copy.mp4_transcription.txt	E:\\ruthi-etv\\ETV\\ETV-ASR\\back_end\\uploads\\tts_uploads\\admin@gmail.com_20251127_122545_Hindi_Sample_1 - Copy.mp4_transcription.txt	उनके सामने उनकी 11 एयर बेसेस डिस्ट्रॉयड है। प्राइम मिनिस्टर खुद कह रहे हैं कि नूरखान पे मजाइले गिरी हैं। लोकल उनके जो वीडियो बना बना के ये भावरपुर का वीडियो है, ये नूरखान का वीडियो है। वहां से एक वो स्टेटमेंट देते हैं कि मैं न्यूक्लियर वेपन से आधे दुनिया को तबाह कर दूंगा। आई सी मोस्ट इररिस्पांसिबल स्टेटमेंट बाय एनी ऑफिशियल ऑफ अ न्यूक्लियर पावर स्टेट। मोस्ट इररिस्पांसिबल। अगर वो ये कह रहा है कि मैं मिसाइल चला के आपका डैम को तबाह कर दूंगा, तो हमें नहीं मालूम कि मंगला डैम कहां पे है, हमें नहीं मालूम मुराला हेडवर्क कहां पे है, हमें नहीं मालूम गुड्डू ब्राज कहां पे है, हमें नहीं मालूम सकर ब्राज कहां पे है। और हमारी मिसाइल तो बिल्कुल प्रिसाइज आती है। पाकिस्तान दोबारा कोई टेररिस्ट की टेररिज्म की हरकत करता है तो इंडिया विल रिएक्ट बैक। पीओके के लोग आर जस्ट नॉट हैप्पी विद पाकिस्तानी पंजाबी मुसलमान। अलवामा हुआ, बालाकोट हुआ, 370 एब्रोगेशन मैं कश्मीर में कोर्ट में था। छोटी-छोटी बात के ऊपर वहां पे हड़ताल हो जाती थी और लोग सड़कों पे आ जाते थे, गोलियां चल जाती थी।\nतो आर्टिकल 370 के ऊपर तो लोगों ने सोचा था पता नहीं क्या ही बवाल आएगा कश्मीर में।\nइन एडिशन टू पाकिस्तान, पाकिस्तान आर्मी, आईएसआई।\nइन ये सारा इकोसिस्टम जो है ना, ये कश्मीर की प्रॉब्लम से फायदे में है। लोकल कश्मीरी खैरिस। तो आम करके उसकी जेब से एक चिट्ठी मिलती थी। जहां तो वो चिट्ठी उसने अपनी मां को लिखी होती थी, क्योंकि उन दिनों मोबाइल तो होते नहीं थे। जहां वो चिट्ठी उसकी मां ने लिखी होती थी और उसने वो पढ़ के अपनी जेब में रखी थी। एक तो थिंग वेयर इट बिलोंग्स। एक लड़का है वो अपनी मदर के पास ही बिलोंग करता है, उसको वापस अपनी मदर के पास जाना है, जाना चाहिए। नो सन शुड बी विदाउट अ मदर एंड नो मदर शुड बी विदाउट अ सन। नमस्कार, आप देख रहे हैं टीवी9 भारतवर्ष। मैं हूं अरुण सुंदराल। कश्मीर की वादियों से जुड़ी एक ऐसी सच्ची कहानी जो एक ऑपरेशन नहीं, दिलों को जोड़ने का प्रयास है। ऑपरेशन मां। क्या पहल है ये? इस पहल के पीछे रहे रिटायर्ड लेफ्टिनेंट जनरल के. जे. एस. ढिल्लोंजी आज हमारे साथ स्टूडियो पे मौजूद हैं। सर, बहुत-बहुत आपका स्वागत है यहां पर। सबसे पहले हमारे जो दर्शक हैं, वो जानना चाहेंगे कि आखिर कश्मीर में बड़ा बदलाव लाने वाला ये ऑपरेशन मां है क्या? \n थैंक यू अरुण और अगर मैं इसको शुरू से बताना शुरू करूं तो जब मैं एक यंग कैप्टन था और 1988 में जब मैं पहली बार कश्मीर गया और वो वो दौर था जब आतंकवाद कश्मीर में नया-नया शुरू हुआ था और जब भी कभी कोई एनकाउंटर होता था तो जो भी कोई टेररिस्ट जो मरता था लोकल कश्मीरी टेररिस्ट तो आम करके उसकी जेब से एक चिट्ठी मिलती थी। जहां तो वो चिट्ठी उसने अपनी मां को लिखी होती थी क्योंकि उन दिनों मोबाइल तो होते नहीं थे। जहां वो चिट्ठी उसकी मां ने लिखी होती थी और उसने वो पढ़ के अपनी जेब में रखी होती थी। और उस चिट्ठी को क्योंकि इंटेलिजेंस पॉइंट ऑफ व्यू से भी उसका चेक करना जरूरी रहता है तो उस आम करके उस चिट्ठी का जो मेन थीम रहता था कि अम्मी जान को सलाम, अम्मी जान को बताना, दुआओं में याद रखना, अम्मी जान के लिए दुआ करना, मेरे लिए दुआ करना। सो 90% मदर के लिए रहती थी रेफरेंस, बाकी 10% मोस्टली सिस्टर के लिए, कभी ब्रदर के लिए और बहुत कम फादर के लिए। तो ये जो चीज थी, ये मेरे दिमाग में उस समय जब मैं यंग कैप्टन था तब से थी। और जब मैं कोर कमांडर बना 2019 में, फरवरी 2019 में, तो सबसे पहली चीज जो मैंने की। मैंने कहा अगर एक लड़का अपनी मां से इतना प्यार करता है और हर सोसाइटी में मां का एक बहुत बड़ा ओहदा है, एक बहुत बड़ा महत्व है, एक प्लेस है। जी। लेकिन कश्मीरी सोसाइटी में जो मैंने देखा अपने 6-7 टेन्योर जो मेरे कश्मीर के हैं, वहां पर मां का एक बहुत ज्यादा प्रभाव रहता है बच्चों के ऊपर। सो उस बैकग्राउंड से मैंने ये शुरू किया कि क्यों ना हम मदर्स को कांटेक्ट करें। कि जिनके बच्चों ने गन उठाई है कि वो अपने बच्चे को बोले तू वापस आ और तेरी हिफाजत रहेगी, तेरे सीक्रेसी रहेगी, तेरे खिलाफ कोई केस नहीं होगा। ये जो कंडीशंस हैं, दीज़ एश्योरेंस इज़ वर अ मस्ट। एंड दे हैड टू बी ऑनर्ड। एंड वंस दिस वर्ड वेंट अराउंड एंड फर्स्ट बॉय हु सरेंडर्ड उसके खिलाफ कोई केस नहीं बना। उसको एक अल्टरनेट जॉब के लिए बताया गया और उसका नाम भी गुप्त रखा गया। तो फिर बाय एंड बाय। जैसे हम बात कर रहे थे फिर काफिला जुड़ता गया और कारवां बनता गया। तो दिस वास द फर्स्ट ऑफ इट्स काइंड पीस इनिशिएटिव बाय अ मिलिट्री कमांडर इन अ कॉन्फ्लिक्ट ज़ोन इन द होल वर्ल्ड। दैट्स व्हाट आई हैव बीन टोल्ड। यह जो ऑपरेशन आपने चलाया, आपने जमीनी स्तर पर इसका कितना असर देखा?  जो आतंकवाद के मामले थे या जो कश्मीरी युवा थे जो आतंकवाद की ओर रुख कर रहे थे, उन्हें वापस लाने में कितना योगदान इस ऑपरेशन ने दिया? देखिए जैसे मैं आपसे बात कर रहा था, करीब-करीब 50 के करीब लड़के, 50 से ज्यादा तो जो मेरा टेन्योर होता था 2019-20।\n उसी दौरान ही वापस आ गए थे।\nऔर अभी जैसे ऑपरेशन मां के ऊपर जो डॉक्यूमेंट्री है, डोकूबे में रिलीज हो रही है 27 अगस्त को।\nजी।\nउसमें जो रिसर्च डाटा है, उसके हिसाब से\n\n17 लड़के वापस आए हैं और ये एक बहुत बड़ी बात है। बिल्कुल। आज की तारीख में मैं कश्मीर में था पहलगाम अटैक के एक दिन पहले 21 अप्रैल को। तो मुझे बताया गया था कि जो पलवामा जहां पे मेन हॉट बेट था। पिछले 2 साल से एक भी कश्मीरी लड़के ने गन नहीं उठाई है। और इस बात में कहीं ना कहीं ऑपरेशन मां का बहुत बड़ा योगदान है। क्योंकि मदर्स ने ये जब अपने बच्चों को बोला कि बेटा ये रास्ता ठीक नहीं है। इस रास्ते का अंत सिर्फ गोली या मौत है। और बच्चे समझे और देखिए साइकिल है। पीस आया तो बच्चों को जॉब मिला। जॉब मिला तो घर में पैसा आना शुरू हुआ। पैसा आना शुरू हुआ तो आतंकवाद की तरफ ध्यान हटना बंद हो गया। आतंकवाद की तरफ ध्यान हटना बंद हुआ तो वापस पीस आया। फिर पीस आया तो जॉब पैसा। तो ये साइकिल जो है, अभी चल रहा है और आगे हमेशा तरक्की पे रहेगा।\nआपको क्या लगता है कि जिस तरह से आपने जिक्र किया कि कोई भी मां या कोई भी अपना पेरेंट्स नहीं चाहेंगे कि उनका जो बेटा है इस तरह से अलगाववाद में जाए या इस तरह से जो है एक्शन ले।\nतो क्या मोटिव रहता है युवाओं का क्या  किस तरह से उनकी ब्रेन वाशिंग होती है, ये क्या साइकिल है इस पर मुझे लगता है कि ज़ोर डालना चाहिए। देखिए अगेन कश्मीर में ना एक इकोसिस्टम काम करता है। उस इकोसिस्टम में शामिल है हुरियत, आतंकवादी, टेररिस्ट एम्पेथाइज़र्स, ओवरग्राउंड वर्कर्स और जो वाइट कॉलर टेररिस्ट हैं, उसके अलावा कुछ। जो लोकल पॉलिटिकल एलिमेंट्स हैं, कुछ एनजीओज़ हैं और कुछ लोकल जो जिसको हम कहते हैं कि लोकल मीडिया आल्सो। इन एडिशन टू पाकिस्तान, पाकिस्तान आर्मी, आईएसआई। इन ये सारा इकोसिस्टम जो है ना, ये कश्मीर की प्रॉब्लम से फायदे में है। जब तक कश्मीर में टेररिज्म चलेगा, जब तक कश्मीर में आतंकवाद चलेगा, ये इकोसिस्टम पनपता रहेगा, इनकी रोटियां सिकती रहेंगी। तो इसी इकोसिस्टम का हिस्सा जैसे मैंने बोला जब मैं 1988 में गया। तो जब टेररिज्म शुरू हुआ तो सबसे पहले उन्होंने क्या किया? उस टाइम पर लकड़ी के यू नो फॉर फ्लमिंग एरियाज में विलेजेस में विलेजेस में स्कूल्स जो थे लकड़ी के होते थे। उन्होंने स्कूलों को आग लगाई। रीज़न ये दिया कि इसमें फ़ौज आके अपना कैम्प बनाएगी। लेकिन एक्चुअल रीज़न था कि स्कूल जला दो। कश्मीरी पंडित जब 1989 ऑनवर्ड्स उनको जब वहां से निकाला गया, एक एक्सोडस हुआ। एक्सोडस हुआ और कश्मीरी पंडित्स कश्मीर के एजुकेशन सिस्टम का मेन स्टे थे। चाहे वो प्राइमरी स्कूल टीचर है, चाहे मिडिल स्कूल, हाई स्कूल, कॉलेज और यूनिवर्सिटी। हर जगह पे कश्मीरी पंडित्स बिकॉज़ दे वर अ एजुकेटेड कम्युनिटी। कश्मीरी पंडित्स का योगदान कश्मीर के एजुकेशन में सबसे ज्यादा था। एक तरफ तो आपके टीचर आपने वहां से निकाल दिए। दूसरी तरफ जो स्कूल की बिल्डिंग थी उसको जला दिया। तो बच्चे के पास जहां तो बिल्कुल पढ़ाई ना करे, जहां करे तो लोकल। मदरसा में जाएगा। ये ये बहुत इंपॉर्टेंट पॉइंट आपने उठाया कि कश्मीरी पंडित्स जो हैं वो एक इंपॉर्टेंट एजुकेशन में उनका रोल रहा। क्या ये सिस्टमैटिकली उनको हटाने की कोशिश थी जितने भी ये जो इकोसिस्टम था? वो डेलिब्रेटली ये चाहता था कि वो हट जाएं और जो यूथ है उनको वैसी एजुकेशन ना मिल पाए जो एक यूथ को आगे जॉब के लिए स्पेसिफिक स्किल्स प्रोवाइड करती है और उन्हें दूसरे राह पर जो आज हम देखते हैं या समय में देखा हमने। उस समय पे इंटरनेट नहीं था, मोबाइल्स नहीं थे, अवेयरनेस नहीं थी और जो भी कुछ बताया जाता था लोकल एनवायरमेंट में। उसको सच माना जाता था। चाहे वो मदरसे में आपके मौलवी साहब बताएं, चाहे आपके किसी रिलीजियस प्लेस के ऊपर आपको नरेशन दी जाए या आपके आस-पड़ोस वाले लोग बताएं, तो वो एक बच्चे का दिमाग को फिक्सेट करता था। रेडिकलाइजेशन की तरफ। जबकि प्रॉपर एजुकेशन सिस्टम था नहीं, कोई उसके ऊपर चेक्स एंड बैलेंसेस नहीं थे और ऊपर से कोई भी जॉब अपॉर्चुनिटीज नहीं थी और ये बच्चा जब 15, 16, 17 साल का होता है। और कॉलेज में एडमिशन के लिए अप्लाई करता है या किसी इंजीनियरिंग कॉलेज में या मेडिकल कॉलेज में या कॉम्पिटिटिव एग्जाम में। ही डस नॉट हैव द बैकग्राउंड। बिल्कुल। और वो कंपीट नहीं कर पाता। उसके अलावा जो स्कूल चल भी रहे थे। उस पे भी हुरियत साल में 20-200 दिन तक हड़ताल करती थी। हुरियत 48 कैलेंडर निकालती थी और बच्चों के स्कूल बंद रहते थे और बच्चे जो नॉर्मल स्कूल में भी जाते थे, वो भी पढ़ाई नहीं कर पाते थे और इन मास एंड ऑफ द एकेडमिक ईयर इन मास सबको प्रमोट कर दिया जाता था। ठीक है, पांचवीं, छहवीं, आठवीं तक। लेकिन जब 10वीं, 11वीं, 12वीं तक के बच्चे बिना पढ़ाई किए हुए पास होते आ रहे हैं और अभी उसको कंपीट करना पड़ रहा है, ही इज नोव्हेयर। व्हेन ही इज नोव्हेयर, ही डजंट सी एन अपॉर्चुनिटी फॉर फ्यूचर जॉब, फॉर फ्यूचर एजुकेशन, फॉर फ्यूचर लाइफ। एंड ही हैज़ नो बेसिक बैकग्राउंड ऑफ़ एजुकेशन और एनीथिंग। ही इज़ अ राइप कैंडिडेट टू बी कन्वर्टेड टू टेररिज़्म। एंड ऊपर से इस्लामिक रेडिकलाइजेशन वास देयर। सो इट वास अ वेरी विशियस सर्कल इन वर्किंग इन अ वेरी विशियस।\n\nइकोसिस्टम। उस बच्चे के पास कोई चॉइस ही नहीं थी इसके अलावा कि गन उठाएं। गन उठाते ही वो रॉबिनहुड बन जाता था। अपनी लोकैलिटी में गर्लफ्रेंड के सामने। लेकिन एक मैं आपको एक डाटा भी देता हूं। मैंने जब कोर कमांडर बना, मैंने पिछले 2-2.5 साल का डाटा कलेक्ट किया। मैंने कहा मुझे बताइए जो लोकल कश्मीरी लड़के ने गन उठाई है, उसकी शेल्फ लाइफ क्या है? आप हैरान होंगे, आपके दर्शक देख के हैरान होंगे कि जो भी कश्मीरी लड़का, ये 2019-18 के डेटा की बात कर रहा हूं। जो भी कश्मीरी लड़का गन उठाता था, 7% पहले 10 दिन में एनकाउंटर में मारे जाते थे। 17% पहले 3 महीने में। 34% 6 महीने में और 64% पहले 1 साल में। यानी कि एक लड़के ने गन उठाई तो उसकी शेल्फ लाइफ मैक्सिमम अबाउट 1 ईयर। और दूसरा डाटा जो मैंने मदर्स को बताया उनको कन्विंस करने के लिए कि जितने भी लड़कों ने कश्मीर में गन उठाई उनमें से 83%, 83% का स्टोन पेल्टिंग का इतिहास था। दैट मीन्स आज का पत्थरबाज कल का टेररिस्ट परसों की डेड बॉडी। तो एक साइकिल, एक साइकिल जब ये मदर्स को समझाया गया, तो मदर्स की ये बात समझ में आई। और कोई भी मां नहीं चाहती कि उसका बच्चा उससे दूर हो।  फॉर टेररिस्ट और अ सोल्जर और अ कॉमन सिविलियन सिटीजन, मदर इज अ मदर इज अ मदर इज अ मदर। एंड इस्लाम तो बोलता है। कहता है व्हेन यू फीड, यू फर्स्ट फीड द मदर, देन फीड द मदर। देन फीड द मदर एंड देयर आफ्टर फीड द फादर। मदर को जन्नत का रुतबा दिया गया है। तो ऐसी सोसाइटी में इट वाज आई थिंक द राइट। इनिशिएटिव एंड विद अ राइट फ्रेम ऑफ माइंड एंड कन्विंसिंग पीपल द मदर, द ब्रदर्स, द चिल्ड्रन, द पेरेंट्स, द फ्रेंड्स, मौलवी साहब, सरपंचेस, द ओपिनियन मेकर्स। फिर वो काफिला जुड़ता गया। एंड दिस ऑपरेशन बिकेम अ बिग सक्सेस। बिल्कुल और जिस तरह से आपने बताया कि ये ऑपरेशन हमने चलाया आर्मी की ओर से ये चलाया गया ऑपरेशन और बहुत सक्सेस मिला और बहुत सारे युवा जो हैं जो भटक गए थे वो वापस आए और नॉर्मल लाइफ उन्होंने आगे जिए लेकिन जैसे पहलगाम हमला हुआ या उसके बाद हमने देखा आर्टिकल 370 वहां से हटाया गया। उसके बाद आप क्या देखते हैं कि कश्मीर या जम्मू कश्मीर के एडमिनिस्ट्रेशन में या  पॉलिसीज में क्या बदलाव आपने देखे जो कि शायद वहां की जो लोकल पॉपुलेशन है उनके लिए बेनिफिशियल है। वो नहीं जानते कि बेनिफिशियल हैं। आपने पॉलिसी वाइज आपने क्या चेंजेस देखे इन सब घटनाओं के बाद? जब आर्टिकल 370 एब्रोगेशन हुआ बल्कि जब पलवामा हुआ, बालाकोट हुआ, 370 एब्रोगेशन मैं कश्मीर में कोर्ट कमांडर था। यानी कि आई वास इंचार्ज ऑफ ऑल द मिलिट्री इंस्टॉलेशंस एंड मिलिट्री मेन पोस्टेड इन द कश्मीर वैली। चाहे वो लाइन ऑफ कंट्रोल है, चाहे वो कश्मीर वैली है। उन सबका इंचार्ज मैं था और एब्रोगेशन ऑफ आर्टिकल 370। इतना इमोटिव इशू था। इतना इमोटिव इशू था कि अगर छोटी-छोटी बात के ऊपर वहां पर हड़ताल हो जाती थी और लोग सड़कों पर आ जाते थे, गोलियां चल जाती थी। तो आर्टिकल 370 के ऊपर तो लोगों ने सोचा था पता नहीं क्या ही बवाल आ जाएगा कश्मीर में। लेकिन आर्टिकल 370 जब हटा 5 अगस्त 2019 के लेकर 3 महीने बाद तक। जो पीसफुल टाइम था, दैट वाज द मोस्ट पीसफुल टाइम इन द हिस्ट्री ऑफ कश्मीरस टेररिज्म। क्यों? अगर हर कोई सोच पाकिस्तान का पूरा जोर लग गया कि आर्टिकल 370 के बाद में हम किसी तरह से कश्मीर में आग फैला दें, बिल्कुल। फलाने कोई चीफ मिनिस्टर्स हैं उन्होंने बोला कि अगर आर्टिकल 370 को कुछ दिया किया तो कश्मीर में तिरंगे को कंधा देने वाला कोई नहीं होगा। यह भी बात बोलेगी कश्मीर में खून की नदियां बह जाएंगी। नथिंग लाइक दैट हैपेंड। कश्मीर रिमेंड पीसफुल, नॉट अ सिंगल इनोसेंट सिविलियन डाइड एट द हैंड्स ऑफ सिक्योरिटी फोर्सेस इन दोस थ्री मंथ्स। यह इसलिए हुआ कि लोगों ने सोचा कि पिछले 35 साल से बहुत देख लिया है। पाकिस्तान यह करेगा, पाकिस्तान वह करेगा, पाकिस्तान यह करेगा। अभी अगर 370 जा रहा है तो लेट्स ट्राई दिस आल्सो। क्योंकि कॉमन कश्मीरी इज नॉट इंटरेस्टेड इन टेररिज्म, इज नॉट इंटरेस्टेड इन लूजिंग देयर संस। दे आर नॉट इंटरेस्टेड इन लूजिंग देयर प्रॉपर्टी। सो दे सेड ओके लेट्स गिव पीस अ चांस। एंड दैट वाज द मेन रीज़न आवाम ने जब बोला कि हमें पीस लाना है वापस तो पीस आया। एंड वो एक साइकिल है, पीस आएगा तो आपकी रोजमर्रा की जो इनकम है वो बढ़ेगी। जब इनकम बढ़ेगी तो आपके घर में अच्छा खाना बनेगा। अच्छा खाना बढ़ेगा, बच्चे अच्छे स्कूल में जाएंगे, पढ़ाई करेंगे, कोई हिटताल नहीं होगी। कोई माई-बाप नहीं, मां-बाप नहीं चाहता कि मेरा बच्चा आतंकवादी बने या। हर कोई बच्चे मां-बाप चाहते हैं कि मेरा बेटा पढ़े, अच्छा रहे, अच्छे जॉब करे, अच्छी शादी करे।\nअभी वो सपने साकार हो रहे हैं।\nNow the Awam is a stakeholder in peace.\nएंड जैसे आपने जिक्र किया पहलगाम के बाद में फर्स्ट टाइम इन द हिस्ट्री ऑफ कश्मीर, कश्मीरी पीपल केम ऑन द रोड्स।\n\nइन सपोर्ट ऑफ इंडियन गवर्नमेंट अगेंस्ट पाकिस्तान। बिल्कुल। इट हैड नेवर हैपन बिफोर। पहलगाम इंसिडेंट के बाद में ये पहली बार हुआ बिकॉज़ कश्मीरी इज नाउ स्टेकहोल्डर इन पीस। He has seen the dividends of peace. बिलकुल। And वो चीज जो है अभी नॉन रिवर्सिबल है और ये पीस अभी आगे ही आगे जाएगा। और मुझे लगता है इसमें जो डिफरेंसेस हैं पाकिस्तान ऑक्यूपाइड कश्मीर और जो कश्मीर है हमारा। वहां के जो डेवलपमेंट के डिफरेंसेस देख लीजिए आप, हर मामले में जो है भारत का जो कश्मीर है, जो पाकिस्तान ने कब्जे में लिया हुआ है, उसके मुकाबले यहां के लोग मुझे लगता है कि ज्यादा रोजगार के अवसर उन्हें मिलते हैं, खासतौर पर आफ्टर 370 के जो एब्रोगेशन के बाद ज्यादा उन्हें अवसर मिले हैं, आप कैसे इसको कंपैरिजन को कैसे देखते हैं आप? देखिए किसी भी कम्युनिटी को, किसी भी ग्रुप ऑफ पीपल को अगर आपने उनकी आइडेंटिटी खत्म करनी है। तो उनकी लैंग्वेज को खत्म कर दीजिए। जो वर्ल्ड लैंग्वेज डे है जो बांग्लादेश में जब ईस्ट पाकिस्तान था, वहां के लोग बंगाली बोलते थे, बांग्ला बोलते थे। लेकिन वेस्ट पाकिस्तानीज दे वांटेड टू इंपोज पंजाबी एंड उर्दू ऑन देम। दे रिटेलिएटेड एंड वो जो सबसे बड़ा नरसंहार हुआ था उसमें उस दिन के वर्ल्ड लैंग्वेज जे बोलते हैं। सिमिलरली अभी पाकिस्तान ऑक्यूपाइड कश्मीर और इंडियन कश्मीर जब लोग जाते थे वहां पे मुजफ्फराबाद बस में अपने रिश्तेदारों से या दोस्तों से मिलने के लिए वापस जब आते थे। तो मैं वहां पे एज अ मेजर, एज अ कर्नल, एज अ ब्रिगेडियर, एज अ जनरल लोगों से मिलता था जो बोलते थे तौबा तौबा तौबा तौबा। वहां पे जितनी गुरबत है, गुरबत मीन्स जितनी गरीबी है। इसे हम बयान नहीं कर सकते और दूसरी बात जो इम्पोर्टेन्ट उन्होंने बोली कि वहां पे कश्मीरी बोलने वाला कोई रह ही नहीं गया। बच्चे या तो उर्दू बोलते हैं या पंजाबी बोलते हैं। और अभी तो क्योंकि सीपैक शुरू है तो मेंडरिन भी शुरू हो गई है उन वहां के स्कूलों में। तो जिस कौम का आप लैंग्वेज खत्म कर दोगे ना, उस कौम की आइडेंटिटी खत्म हो जाती है। क्योंकि आपके चेहरे पे तो रेखा नहीं है कि आप कौन हैं क्या नहीं। जब आप बोलते हैं तो आपके लहजे से, आपके एक्सेंट से, आपके डायलेक्ट से, आपकी भाषा से पहचान बनती है कि आप उस इलाके के हो, उस स्टेट के हो, उस कंट्री के हो। सो दिस इज अ वेरी सिस्टमैटिक वे ऑफ डिग्रेडिंग कश्मीरीज़ इन पाकिस्तान ऑक्युपाइड कश्मीर। वेयर एस इन इंडियन कश्मीर ईच एंड एवरी पर्सन स्पीक्स कश्मीरी। बिल्कुल। इन एडिशन बिकॉज़ ही इज एजुकेटेड, ही मे बी स्पीकिंग हिंदी, उर्दू, इंग्लिश। बट हिज मदर टंग कश्मीरी इज वेरी मच रेवलेंट एंड इट इज देयर। बिल्कुल। ये जो पाकिस्तान समर्थित आतंकवाद है, आप कैसे जो भारत के हाल ही में लिए गए स्टेप्स हैं, चाहे वो सर्जिकल स्ट्राइक हो, एयर स्ट्राइक हो या फिर हाल ही में लिया गया ऑपरेशन सिंदूर, आप इन स्टेप्स को किस तरह से देखते हैं? पाकिस्तान आतंकवाद जो फैलाता है, उसको कर्व करने के लिए? क्या ये निर्णायक भूमिका आगे भी निभा सकते हैं या फिर लॉन्ग टर्म सलूशन क्या देखते हैं आप इसका? देखिए ऑपरेशन सिंदूर के बाद प्रधानमंत्री श्री नरेंद्र मोदी जी की एक यू नो वीडियो मैसेज था एक। उसमें उन्होंने पूरा जो अपना फ्यूचर का जो काउंटर टेररिज्म स्ट्रेटेजी।\nकरीब-करीब मैंने नहीं देखा इतने बढ़िया तरीके से इतनी बड़ी स्ट्रेटेजी को बयान करना। उसमें उन्होंने बोला था कि टेररिज्म को एक्सेप्ट नहीं किया जाएगा।\nटेररिस्ट और टेररिस्ट को सपोर्ट करने वाले में कोई भी भेदभाव नहीं माना जाएगा।\nटेररिस्ट और टेररिस्ट को सपोर्ट करने वाला चाहे वो स्टेट है उसको भी हम टेररिस्ट ही मानेंगे।\nऔर इंडिया अभी टेररिज्म के खिलाफ कार्रवाई करेगा चाहे वो इंटरनेशनल लेवल पे हो चाहे वो डोमेस्टिक लेवल पे हो। प्रोपेशन सिंदूर उसका एक हिस्सा था, उसका एक मुजाहिरा था, उसका एक नमूना था, उसका एक इंडिकेशन था। सो ये जो सब चीजें हैं टेरर फंडिंग को रोकने के लिए और इंटरनली जो टेररिज्म को सपोर्ट करते हैं चाहे वो ओवरग्राउंड वर्कर्स हैं, चाहे वो टेरर सिंपैथाइजर्स हैं, उनको भी निकाल निकाल के अगर कोई गवर्नमेंट जॉब में बैठा हो उसको भी गवर्नमेंट जॉब से बर्खास्त किया जाए। सो आई थिंक वी आर गोइंग द राइट वे। द मैसेज हैज़ बीन कन्वेयर्ड लाउड एंड क्लियर इन ऑपरेशन सिंदूर एंड दिस इज़ द न्यू नॉर्मल फॉर काउंटर टेररिज़्म ऑपरेशंस। ऑपरेशन सिंदूर पर एक बार फिर से आऊंगा मैं लेकिन इससे पहले बड़ा सिंपल सा क्वेश्चन पूछूंगा। पहले हम देखते थे अक्सर जो है कश्मीर में हड़तालें, पत्थरबाजी की घटनाएं, कश्मीर बंद बुला लिया किसी ने, अब क्यों नहीं होता हो? क्योंकि वो मैंने बोला ना इकोसिस्टम। और इकोसिस्टम की दुकान बंद हो गई।\nपहले ₹500 देके एक बच्चे को बोलते थे जाके पत्थर फेंक के आ और ₹500 लेके आता था, मां जाके दुकान से राशन लाती थी और रात का खाना बनता था।\nअभी वही लड़का जब टूरिस्ट आते हैं या यात्री आते हैं वो सुमो चला रहा है और रात को ₹3000 लेके आ रहा है।\n तो क्यों मां अपने एक बच्चे को भेजेगी पत्थर फेंकने के लिए जिसमें जान का भी खतरा है।\nजबकि पीसफुल तरीके से वो अभी 3000 कमा रहा है, शादी हो रखी है, बच्चे हैं।\nबच्चे स्कूल पहले तो जाते नहीं थे जैसे मैंने आपको बोला, अगर स्कूल जाते भी थे तो हड़ताल 280 ।\n\nदिन अड्डाल। अभी हर रोज स्कूल खुलता है, बच्चे स्कूल जाते हैं और बच्चों का एक भविष्य है। देयर इज अ फ्यूचर। मदर कैन सी द फ्यूचर ऑफ हर चाइल्ड। एंड व्हाई शुड दे गो बैक टू दोस डेज? बिल्कुल। जबकि पहले रात में 5:00 बजे के बाद कोई घर से बाहर नहीं निकलता था। अभी आप देखिए लाल चौक में रात के 11:00-12:00 बजे तक बिल्कुल जैसे इंडिया गेट है, वैसे ही लाल चौक कश्मीर का बिल्कुल एकदम खुशहाली है। सो नोबडी वांट्स टू गो बैक टू दोज़ डेज़। एंड सिंस नोबडी वांट्स टू गो बैक एंड नो टेररिज्म कैन सर्वाइव विदाउट द लोकल सपोर्ट। लोकल स्पॉट होना बहुत जरूरी है किसी भी इंसिडेंसी को सरवाइव करने के लिए। बिल्कुल। दैट लोकल स्पॉट इज नाउ डिमिनिशिंग। एंड जो थोड़े बहुत टेररिस्ट अभी रह भी गए हैं कश्मीर, उनमें से भी 80% पाकिस्तानी हैं। दिस ओनली शोज कि लोकल बॉय इज नॉट इंटरेस्टेड टू जॉइन टेररिज्म।\nएंड वो टेररिस्ट भी गांव में पहले बहुत आते थे खाना लेने के लिए, अभी खाना नहीं लेने आते गांव में।\nउनको मालूम है गांव में जाएंगे तो इंफॉर्मेशन जाएगी।\n\nअभी वो जंगल में रहते हैं, वहीं पे अपनी हाई रोड में।\nऔर जैसे हमने देखा था ऑपरेशन महादेव में। बिलकुल। गांव में नहीं आते क्योंकि गांव के ऊपर उनको भरोसा नहीं है और गांव वाले अभी नहीं चाहते हैं कि आतंकी उनके गांव में आए। दिस इज अ बिग चेंज, बिग चेंज एंड इट्स अ चेंज इन द सोसाइटल वे ऑफ लिविंग। बिलकुल। एंड आई एम वेरी हैप्पी टू सी दिस। हमने देखा था ऑपरेशन सिंदूर पे फिर से आते हैं उसपे देखा कि इलेक्ट्रॉनिक वॉरफेयर या ड्रोन वॉरफेयर हमने देखा किस तरह से पाकिस्तान की ओर से भेजे गए भारत ने मुंह तोड़ जवाब दिया। तो आप कैसे देखते हैं इंसर्जेंसी में ये इलेक्ट्रॉनिक या ड्रोन वॉरफेयर चाहे वो रूस यूक्रेन युद्ध हो, चाहे कोई भी इलाके में युद्ध चल रहा है इस समय। ड्रोन वॉरफेयर बहुत जो है एक की आस्पेक्ट बनकर उभरा है।\nतो आप इसे फ्यूचर इसका फ्यूचर कैसे देखते हैं और भारत को इसके लिए क्या स्टेप्स आगे अपनाने चाहिए।\nउन पर अगर हम बात करें।\nदेखिए टेक्नोलॉजी इज अ इवॉल्विंग फील्ड।\nसो इज डिफेंस टेक्नोलॉजी। एंड जब डिफेंस टेक्नोलॉजी इवॉल्व करती है, डिफेंस वेपन सिस्टम्स इम्प्रूव करते हैं, तो वॉर फाइटिंग जो है उसको भी इवॉल्व होना पड़ता है। यू नो आपकी टैक्टिक्स, आपकी ऑपरेशनल आर्ट, आपकी स्ट्रेटजी दे आल्सो हैव टू इवॉल्व। नाउ, हू कुड हैव इमेजिन फ्यू इयर्स अगो कि टू न्यूक्लियर पार्ट्स फर्स्ट टाइम इन द हिस्ट्री ऑफ द वर्ल्ड कम टू अ स्टेज वेयर दे आर एंगेज्ड इन अ वॉर विद ईच अदर। फर्स्ट टाइम इन द हिस्ट्री टू न्यूक्लियर पावर्स केम टू अ वॉर। एंड फॉर द फोर डेज ऑफ द वॉर, नॉट अ सिंगल कॉम्पिटेंट सोल्जर और नॉट अ सिंगल कॉम्पिटेंट इक्विपमेंट क्रॉस द इंटरनेशनल बाउंड्री और लाइन ऑफ कंट्रोल। सारी लड़ाई जो है, हवा में और ड्रोन्स के हिसाब से हुई। लॉन्ग रेंज वेपन सिस्टम के साथ हुई, इलेक्ट्रॉनिक वॉरफेयर के साथ हुई। लेकिन एक भी ना कोई टैंक, ना कोई तोप, ना कोई जवान। हमारी तरफ से क्रॉस किया ना उनकी तरफ से भी क्रॉस किया, कोई हमला नहीं हुआ।\nSo this is a new phase of warfare.\nAnd if this is a new phase of conventional warfare,\nसिमिलरली द कन्वेंशनल वॉरफेयर  हैज़ अ इफेक्ट ऑन द नॉन कन्वेंशनल वॉरफेयर।\nतो ड्रोन्स जो है काउंटर टेररिज्म ऑपरेशन में भी इस्तेमाल होंगे। दुनिया में हो रहे हैं।\nहमारे जम्मू कश्मीर में भी और जहां पे इंसिडेंसी है वहां पे ड्रोन का इस्तेमाल चाहे वो सर्विलांस के लिए है, चाहे वो इंफॉर्मेशन के लिए है, चाहे वो लॉजिस्टिक्स के लिए है।\nचाहे वो इनफैक्ट आर्म ड्रोन आर आल्सो पार्ट ऑफ द आर्म एरीना।\nसो एनी कंट्री व्हिच डिसाइड्स टू यूज आर्म ड्रोन अगेंस्ट इट्स ओन सिटीजंस। दे आर यूजिंग इट। इंडिया इज नॉट यूजिंग, इंडिया हैज़ नेवर यूज्ड हैवी वेपनरी अगेंस्ट काउंटर टेररिस्ट ऑपरेशन। अगर दुश्मन टेररिस्ट के पास एलएमजी है तो हम भी एलएमजी यूज करते हैं। टेररिस्ट के पास रॉकेट लांचर है तो हम भी रॉकेट लांचर यूज करते हैं। हमने कभी भी हैवी वेपनरी इंडिया में यूज़ नहीं की जब कि पाकिस्तान तो वहां पे गन शिप्स, एयरक्राफ्ट्स, हेलीकॉप्टर्स, आर्टिलरी यूज़ करता है टेररिस्ट के खिलाफ और उनके टेररिस्ट के खिलाफ। बिल्कुल। सो वी हैव अ वेरी वेरी  उचिस्तान में देखा किस तरह से होता है या फिर जो नए-नए आतंकी गुट जो है लगातार हमला करते हैं उनको कब करने के लिए कितना डीइम्यूनाइज वे में वो करते हैं।  एमरन मिसाइल है जो F16 पे फिट होती है।  दैट इज गिवन टू पाकिस्तान ओनली ऑन द प्रमाइस कि इट विल नॉट बी यूज्ड इन कन्वेंशनल वॉरफेयर। इट विल ओनली बी यूज्ड फॉर  काउंटर टेरर ऑपरेशंस। सो, आवर वे ऑफ वॉर फाइटिंग इज डिफरेंट, आवर इथोड्स आर डिफरेंट, आवर कल्चर आर डिफरेंट। आई ऑलवेज से 5000 साल पुरानी सभ्यता के वंशज हैं हम। ना, आवर एथिकल बिहेवियर इज डिफरेंट। बिल्कुल और उसी बिहेवियर का एक ऊपर जो है हम ऑपरेशन मां को देख सकते हैं। बिल्कुल। सी, ऑपरेशन मां जो है ना एक इज अ वेरी इमोशनल सब्जेक्ट एंड टॉपिक। एंड जैसे आपने पहले सवाल में एक पूछा था कि कैसे आपको फील हुआ।\nमैं कुछ मदर से मिला हूं जिनके बच्चे वापस आए।\n एंड आई स्टिल रिमेंबर इन बारामुल्ला अ पर्टिकुलर मदर।\nजैसे मैं उनको मिला तो उन्होंने पहले तो जैसे होता है कि बहुत अच्छा हुआ आंखों में आंसू आ रहे हैं, रो भी रहे हैं।\nफिर देन शी हेल्ड माय हैंड।\n\nएंड शी हेल्ड माय हैंड एंड शी किस्ड माय हैंड, बोसा बोलते हैं उसको। जो आपके बहुत नजदीक हो जिसने आपके लिए बहुत कुछ किया ना उसको फिर आप समथिंग लाइक दिस। तो उन्होंने मेरा हाथ करीब 2 मिनट पकड़ के रखा एंड शी केप्ट लुकिंग इंटू माय आइज। एंड सेइंग प्रोबेबली नथिंग बट कन्वेइंग के इफ यू आर द वन हु गॉट माय सन बैक। और एक मां के लिए कितनी बड़ी बात है कि उसका बच्चा फ्रॉम अ कंफर्म डेथ ही कम्स बैक टू हर। एंड आज वो बच्चा अपनी मां के साथ खुशहाल है। पूरा परिवार खुशी से रह रहा है, शादी वादी किया हुआ है। इस ऑपरेशन मां जो डॉक्यूमेंट्री है, इसमें भी जो एक्चुअल लड़के जिन्होंने गन उठाई थी, उनकी स्टोरी है। कैसे उन्होंने गन उठाई, क्यों गन उठाई, क्या हुआ उनके साथ जब वो टेररिज्म टेररिस्ट के साथ चल रहे थे? और कैसे उनकी मदर्स ने या उन्होंने वापस आने की कोशिश की और कैसे सिक्योरिटी फोर्सेस ने उनको हेल्प किया? कैसे वो आज जो जिंदगी जी रहे हैं, क्या नतीजा लेकर आए हैं वापस? मुझे लगता है कि जो पाकिस्तान की ओर से प्रोपेगेंडा फैलाया जाता है कि कश्मीर में आर्मी जो है क्रुएलिटी करती है, जो भी करती है जो प्रोपेगेंडा उनका है। ऑपरेशन मां उसका एक माकूल जवाब है और इस तरह की डॉक्यूमेंट्री से ये पूरी दुनिया आई गेस ये देखे कि किस तरह से जो है एक ह्यूमनाइज्ड वे में अगर कोई गलत रास्ते पर चल भी गया है उसे वापस कैसे लाया जाए। ये एक बिल्कुल मिसाल के तौर पर पेश होना चाहिए। सी, ऑपरेशन मां जो है, मतलब इट्स वन ऑफ द पीस इनिशिएटिव्स। लाइक एज अ कोर कमांडर, मेरा जो काउंटर टेररिज्म या हार्ड ऑपरेशंस थे ना, दैट वाज ओनली 10% ऑफ माय जॉब। 90% ऑफ़ माय जॉब वास कि कंसोलिडेट द पीस व्हिच हैज़ बीन अचीव्ड। हेल्प इन नेशन बिल्डिंग, हेल्प इन स्टेट्स इकॉनमी बिल्डिंग, हेल्प इन स्टेट्स पीस। एंड मेक श्योर द यंग बॉयज़ डू नॉट गो बैक टू द सेम रूट अगेन। एजुकेशन सिस्टम इम्प्रूव करो, हेल्थ सिस्टम इम्प्रूव करो। यू नो, सैनिटेशन इम्प्रूव करो। बच्चों की बेसिक अवेयरनेस इम्प्रूव करो। क्लीनीनेस ऑफ़ द एरिया, जॉब क्रिएशन। सो ये सब चीजें जो हैं, वेदर गवर्नमेंट इज डूइंग अ लॉट। इस चीज की तरफ 90% ध्यान रहता है। बिल्कुल। और बाकी 10% तो हार्ड ऑपरेशंस विल कंटिन्यू। वो भी जरूरी है क्योंकि पाकिस्तानी टेररिस्ट अगर इनफिल्ट्रेट करते हैं तो उनको भगाना बहुत जरूरी है। पाकिस्तान के जो जिहादी जनरल हैं, असीम मुनीर, अमेरिका में जा के परमाणु धमकियां देते हैं भारत को, आप इन धमकियों को कैसे देखते हो? क्या इंडिया को इन धमकियों को सीरियसली लेना चाहिए? देखिए जो आसिफ मनीर ने जो पाकिस्तान के अभी फील्ड मार्शल अपने को बना दिया है। तो जब एक अमेरिका जैसे देश की धरती पर जाके जो कि एक डेमोक्रेसी है। वहां से एक वो स्टेटमेंट देते हैं कि मैं न्यूक्लियर वेपन से आधे दुनिया को तबाह कर दूंगा। अशी मोस्ट इररिस्पोंसिबल स्टेटमेंट बाय एनी ऑफिशियल ऑफ अ न्यूक्लियर पावर स्टेट। मोस्ट इररिस्पोंसिबल एंड अनफॉर्चूनेट पार्ट इज जहां तो वो होस्ट कंट्री और होम कंट्री की परमिशन के साथ ये स्टेटमेंट दी जाती है। आई हैव बीन अ वेरी सीनियर आर्मी ऑफिसर। यू जस्ट कांट गो एंड मेक अ स्टेटमेंट लाइक दिस। जहां अगर मान लो कि उन्होंने बोल भी दिया तो होम कंट्री या होस्ट कंट्री उसको बाद में स्नब करती है, रिबट करती है, कंडेम करती है। ऐसा कुछ भी नहीं हुआ है। दैट मीन्स इट इज एक्सेप्टेड ऑन अ डेमोक्रेसी सोइल टू गेट अप एंड यू नो गिव अ स्टेटमेंट कि आई विल यूज न्यूक्लियर वेपन्स एंड डिस्ट्रॉय हाफ द वर्ल्ड। दैट इज वन पार्ट, व्हाट्स बस इररिस्पोंसिबल से।\nसेकंड पार्टी सेज अगर आपने पानी रोका, आपने डैम बनाए तो मैं मिसाइल से डैम तबाह करता हूं।\nअभी ये जो मिसाइल्स जिसकी वो बात कर रहे हैं, ऑपरेशन संदूर में भी उन्होंने यही मिसाइल चलाई थी।\nउनमें से एक भी मिसाइल टारगेट पे हिट नहीं किए।\nऔर हमारी मिसाइल्स चाहे वो टेरर टारगेट थे। चाहे वो उनके एयर बेसिस थे, 100% प्रेसिजन हिट्स थे। बिल्कुल। अगर वो ये कह रहा है कि मैं मिसाइल चला के आपका डैम को तबाह कर दूंगा, तो हमें नहीं मालूम कि मंगला डैम कहां पे है, हमें नहीं मालूम मराला हेडवर्क कहां पे है, हमें नहीं मालूम गुड्डू बैराज कहां पे है, हमें नहीं मालूम सकर बैराज कहां पे है। और हमारी मिसाइल्स तो बिल्कुल प्रसाइज आती हैं। बिल्कुल। आपकी पहुंच भी नहीं पाई और हमने हिट भी किया, सब वो भी दिखाए। यू कुंट, यू कुंट स्टॉप इट। बिल्कुल। एंड अगर मतलब यह एक ऐसी मिलिट्री है जिसने इतिहास में एक भी जंग नहीं जीती। यह एक ऐसी मिलिट्री है पाकिस्तान आर्मी जिन्होंने वर्ल्ड वॉर 2 के बाद वर्ल्ड कप बिगेस्ट सरेंडर 93000 स्टैंडिंग आर्मी, नेवी, एयरफोर्स सरेंडर किया। मैं कैप्चर की बात नहीं कर रहा हूं। लड़ते हुए कैप्चर हो जाएं अलग बात है। सरेंडर जब कि आपके पास हथियार, एमुनिशन सब कुछ है। थाउजेंड्स ऑफ़ सोल्जर्स। 93000 एंड फिर वो हमारे यहां रहे सालों तक। स्कोच भी पी, गोल्फ भी खेला। और वो आर्मी बोलती है कि मैं न्यूक्लियर बम चला दूंगा। न्यूक्लियर वेपन इज नॉट अ वेपन ऑफ वॉर, न्यूक्लियर वेपन इज अ वेपन ऑफ थ्रेटन बीइंग। नो रिस्पांसिबल नेशन।\n\nविल से कि मैं हाफ द वर्ल्ड आई विल डिस्ट्रॉय।\nआई थिंक दिस इज अ मोस्ट इर्रेस्पोंसिबल स्टेटमेंट एंड प्रोबेबली डजंट इवन नो न्यूक्लियर वेपन्स क्या होते हैं।\nसो  ये जो आपने 90 प्लस थाउजेंड की सोल्जर्स की बात की एक आउट ऑफ द टॉपिक एक सवाल आपसे पूछूंगा आपको क्या लगता है कि जो शिमला समझौता हुआ था वो थोड़ा  इजी टर्म्स पे जो है समझौता हो गया जब हमारे पास इतना बड़ा लेवरेज था। कश्मीर समस्या का हल नहीं हो सकता। चाहे हाजीपीर 1965 में हाजीपीर पास हमने कैप्चर किया। चाहे हाजीपीर को वापस देना इट वाज अ वेरी स्ट्रेटेजिक पास, इट्स नॉट अ टैक्टिकल पास। इट्स अ स्ट्रेटेजिक पास। तो गिव इट बैक, आई थिंक व्हाट द बिगेस्ट मिस्टेक एंड शिमला समझौते में हमारे पास हमारा जो 54 प्रिजनर्स ऑफ वॉर पाकिस्तान के पास है। हमने ₹93000 वापस कर दिए, वी कुडंट इवन यू नो नेगोशिएट फॉर दोज़ 54। एंड देयर वास सच अ बिग लिवरेज ऑफ 93000 पीपल वी कुड हैव नेगोशिएटेड फॉर मच मोर परमानेंट सॉल्यूशन ऑफ कश्मीर पीओके टू बी रिटर्न। स्काई इज द लिमिट व्हेन यू हैव सच अ बिग लिवरेज। बट एनीवे, एक शेर है ना कि लम्हों ने खता की, सदियों ने सजा पाई। सो दैट इज व्हाट हैपन्स। अभी हमने जिक्र किया कि जो जनरल हैं उन्हें फील्ड मार्शल खुद को उन्होंने दिया या अब सरकार ने दिया, ये तो डिबेटेबल है। लेकिन इससे पहले ऑपरेशन सिंदूर से पहले जितने भी ऑपरेशन हुए, हमने देखा कि कहीं ना कहीं पाकिस्तान नैरेटिव में कहीं ना कहीं आगे रहता था। अपनी आवाम को समझाना हो या फिर जो भारत में भी हमने देखा कि किस तरह से सर्जिकल स्ट्राइक के सबूत मांगे गए, एयर स्ट्राइक के सबूत मांगे गए। लेकिन इस बार एक नैरेटिव में भी चेंज आया सरकार की ओर से कि सबूत भी दिखाए हमने। हमने नहीं दिखाए जो पाकिस्तान से ही वीडियो वायरल आने लगे होने लगे और भारत के जो भी प्रतिनिधित्व जो वो थे डेलीगेट्स थे वो पूरी दुनिया में गए ऑपरेशन सिदूर के बारे में बताया तो आप एक शिफ्ट देखते हैं नैरेटिव बिल्ड करने में ये बहुत एक इंपॉर्टेंट पार्ट ऑफ वॉर है। देखिए। इसमें ना एक बहुत बड़ा जो चीज़ है नैरेटिव बिल्डिंग में, उसमें इंडिया इज़ अ वाइब्रेंट डेमोक्रेसी।  एंड वी अलाउ डिसेंट, वी अलाउ रिसेंटमेंट, वी अलाउ पीपल आस्किंग क्वेश्चन टू द गवर्नमेंट। दैट इज द बेसिस ऑफ दी, दैट इज द बेसिस। डेमोक्रेसी में ये सब कुछ जायज है। अभी जो सवाल पूछने वाला है वो सही सवाल पूछता है, नहीं पूछता, किस मंशा से पूछता है, वो सेपरेट इशू है। पाकिस्तान में कहने को डेमोक्रेसी है, शेम डेमोक्रेसी है। दैट्स व्हाई वहां पे कोई सवाल पूछने की हिम्मत भी नहीं करता है। जबकि उनके सामने हैं बहावलपुर, मरीद के से लेकर कोटली और ऊपर मुजफ्फराबाद तक पूरे टारगेट डिस्ट्रॉयड हैं। उनके सामने हैं उनके 11 एयर बेसेस डिस्ट्रॉयड हैं। प्राइम मिनिस्टर खुद कह रहे हैं कि नूरखां पे और मजाइले गिरी हैं। लोकल उनके जो वीडियो बना बना के ये भावरपुर का वीडियो, ये नूर खान का वीडियो। वो सब कुछ दिख रहा है पब्लिक को लेकिन फिर भी वो सवाल नहीं पूछ सकते। क्योंकि पाकिस्तान में डेमोक्रेसी नहीं डिक्टेटरशिप है। और उनको जो है फील्ड मार्शल उनको जो भी नैरेटिव दिया जाता है पाकिस्तानी सिर्फ वही बोलेगा चाहे सोशल मीडिया चाहे अदरवाइज। सो दैट्स अ सटल डिफरेंस इन बीइंग अ वर्ल्ड्स बिग्गेस्ट डेमोक्रेसी एंड बीइंग अ वर्ल्ड्स बिग्गेस्ट टेररिस्ट एंड न्यूक्लियर स्टेट। वहां पे जुबान खोलने की आपको हिम्मत नहीं है और यही चीज जो है यू नो ये जो सेंटीमेंट्स हैं ये ऑपरेशन मां में भी जाहिर होते हैं। क्योंकि हमारी पब्लिक को हम अपना समझते हैं। वो बच्चा हमारा है, उस बच्चे की मां जो उसको वापस लाने की कोशिश कर रही है। शी इज एन इंडियन सिटीजन, वी केयर फॉर आवर सिटीजन्स। पाकिस्तान डजंट हैव एनीथिंग लाइक दिस, पाकिस्तान ने तो अपने सोल्जर्स की डेड बॉडी वापस नहीं ली थी। कारगिल में बिल्कुल। जब मैं कोर कमांडर था, पांच पाकिस्तानी टेररिस्ट लाइन ऑफ कंट्रोल के ऊपर हमने मारे। उनको मैसेज दिया कि इनकी बॉडी ले जाइए, नहीं ले के गए। कुत्तों ने खाई वो बॉडी वहां पे। वो वापस नहीं ले के गए। वी केयर फॉर लाइक अगेन कम बैक। 5000 साल पुरानी सभ्यता के वंशज हैं। हमारा कल्चर, हमारे इथों से हमारा वे ऑफ़ वर्किंग इज़ डिफरेंट। ये तो कौन पाकिस्तान में मुझे बताओ एक भी किसी टेररिस्ट की मां को बोला हो कि मैं तेरे बच्चे को वापस लाता हूं। बिलकुल नहीं। और ये सारी वीडियोस हमने सोशल मीडिया पर देखी भी हैं। कश्मीर में जब ऑपरेशन होता है और आर्मी जो है एक एक घर हाइड आउट में अगर आतंकवादी हैं, तो हमने देखा है किस तरह से जो मां-बाप हैं वो अपील कर रहे होते हैं उनसे कि वापस आ जाओ और जिस तरह से आपने जिक्र किया कि कितने सारे जो लड़के हैं।  वो गलत राह पर थे और वापस आए और कहीं ना कहीं एक फिर से कहूंगा ये मिसाल है ये आपने खुद जिक्र किया कि वर्ल्ड में अपनी तरह का पहला ऑपरेशन था और मुझे लगता है कि पूरी दुनिया को इसके बारे में जानना चाहिए और दुनिया भर में अगर कहीं इस तरह की इंसर्जेंसीज हैं तो यूज होना चाहिए इसको।\nसही बात कह रहे हैं।\nऐसा भी टाइम आए थे जब  ऑपरेशन चल रहा है, एक लोकल कश्मीरी लड़का अंदर फंसा हुआ है।  एनकाउंटर इज ऑन। उसके मां को, बाप को या भाई को या वहां से गांव से लेके आते हैं। उससे बात करवाते हैं मोबाइल के ऊपर और इसी दौरान लड़के का मोबाइल का रिचार्ज खत्म हो जाता है। हम अपनी पॉकेट से उसका\n\nरिचार्ज करवाते हैं ऑनलाइन ताकि उसकी बातचीत अपनी मां के साथ जारी रहे और ये आपको कहीं देखने को नहीं मिलेगा। ये नहीं मिलेगा देखने को और वो लड़का बचता है, वापस आता है, अपनी मां से मिलता है, पेरेंट्स से मिलता है। तो ये एक मिसाल है जहां पे वी वी हैव अ सॉफ्ट कॉर्नर फॉर आवर सिटीजन। बिकॉज़ वी आर पार्ट ऑफ द सोसाइटी। पाकिस्तान में क्या है एक बार आर्मी ऑफिसर बन गया तो ही बिकम्स यू नो समथिंग बिग। वी आर सेम सोसाइटी, वी कम फ्रॉम द सेम सोसाइटी आफ्टर रिटायरमेंट, वी गो बैक टू द सेम सोसाइटी। यह एक फर्क है।\nवहां पे एवरीथिंग इज बेस्ड ऑन यू नो कॉर्नर प्लॉट्स एंड पिज़्ज़ा चेन्स।\nइंडिया में वो नहीं है।\nहाल ही में ट्रंप प्रशासन की जिस तरह से मैंने जिक्र किया कि कैसे जो जनरल है वो जाता है वहां पर और पूरी दुनिया को तबाह करने की धमकी देता है। क्रम प्रशासन का नर्म रुख जो हाल ही के कुछ समय में आया है, आप इसको कैसे देखते हैं? क्या भारत के लिए एक अच्छा संकेत नहीं है ये? देखिए जो पाकिस्तान की जियोस्ट्रेटेजिक लोकेशन है। वो बहुत इम्पोर्टेन्ट है और पाकिस्तान आर्मी इसको समझती है। पॉलिटिशियंस को समझ आए नहीं आए अलग बात है, पाकिस्तान आर्मी समझती है। अब देखिए पाकिस्तान की लोकेशन है, साउथ में अरेबियन सी है और इंडियन ओशन है। एनी नेवल स्पॉट और ए नेवल अमाडा व्हिच हैज़ टू कम कैन हिट पाकिस्तान कोस्ट। उसके साउथ वेस्ट में आप देखेंगे तो अरेबियन सी अपना पर्शियन गल्फ है, स्ट्रेट ऑफ़ होरमुज़ है। दुनिया का पूरा एनर्जी का बेसिन है वो। पूरी वहां से जितनी भी सप्लाई चल रही है, जितनी भी ट्रैफिक है, जितने भी शिप्स हैं, उसके ऊपर बैठा हुआ है। ग्वादर पोर्ट जो चाइना के पास है, दैट्स द मोस्ट स्ट्रेटेजिक पोर्ट इन दैट एरिया। उसके देखिए उसके वेस्ट में ईरान है। कल को ईरान के खिलाफ कोई भी कार्यवाही करनी है, पाकिस्तान की जमीन, उनके एयर बेसेस, उनकी स्पेस चाहिए। बिल्कुल। और यही जरूरत थी जब अमेरिका ने ईरान पे न्यूक्लियर बॉम्ब्स न्यूक्लियर के खिलाफ कार्रवाई की बी टू बॉम्बिंग करके। दैट टाइम आल्सो पाकिस्तान वाज कंसील्ड एज एन ऑप्शन टू अटैक ईरान फ्रॉम द ईस्ट। ऊपर चले जाओ तो अफगानिस्तान है, अनफिनिश्ड एजेंडा। अगर अफगानिस्तान में फिर से कोई कार्यवाही करनी पड़ती है तो पाकिस्तान की ज़रूरत है। उसके ऊपर चाइना, ईस्ट में इंडिया। इंडिया चाइना के खिलाफ फिर लॉन्ग टर्म कोई प्रॉब्लम आती है तो वेस्ट नीड्स पाकिस्तान। तो पाकिस्तान ऐसी लोकेशन है कि उसकी ज़रूरत उनको पड़ेगी ही पड़ेगी। और पाकिस्तान नोज इट और पाकिस्तान इसका फुल फायदा उठाता है। और इसलिए पाकिस्तान को हम अगर सोचे कि हमारे कहने पे कोई पाकिस्तान से साथ छोड़ देगा, नहीं। दुनिया में सिर्फ पर्सनल इंटरेस्ट होते हैं हर किसी के। दूसरे के लिए कोई कुछ नहीं करता। हमें अपने लिए खुद करना पड़ेगा जैसे हमने ऑपरेशन संदूर भी किया। और क्योंकि हम दुनिया की बिगेस्ट डेमोक्रेसी हैं, फोर्थ लार्जेस्ट इकॉनमी हैं, मिलिट्री माइट हैं। तो जब हम करते हैं कुछ देन नो वन क्वेश्चन अस। अगर यही काम हमने किया होता, हम कहीं 150th इकॉनमी होते और लोगों ने हमें करने ही नहीं देना था। दिस वर्ल्ड ओनली अंडरस्टैंड्स स्ट्रेंथ। दैट इज द मेन थिंग। लेकिन देखिए डोनाल्ड ट्रम्प ने कहीं ना कहीं समर्थन दिया। आसिम मुनीर को, आसिम मुनीर मतलब पाकिस्तान आर्मी। पाकिस्तान आर्मी जिसका लिंक सीधा-सीधा आतंकवादियों से है। तो भारत के लिए सुरक्षा के लिहाज से एक बहुत खतरनाक सिचुएशन बन जाती है। देखिए जो भी सिचुएशन डेवलप होगी, हमें उसका मुकाबला खुद करना है, हमें किसी के सहारे की उम्मीद नहीं रखनी चाहिए। वी हैव टू फाइट आवर ओन बैटल्स, नोबडी इज गोइंग टू कम एंड फाइट ओवर बैटल। द ओनली आंसर इज टू डेवलप इकोनॉमिकली, डेवलप मिलिटरली एंड हैव स्ट्रांग पॉलिटिकल विल। अगर ये तीन चीज़ नहीं है, तो हमारी डिप्लोमेसी भी वीक होगी, हमारी इकॉनमी भी वीक होगी, हमारी मिलिट्री भी वीक होगी, हमारी गवर्नमेंट भी वीक होगी। देन वी कैन नॉट फेस द वर्ल्ड। वी नीड टू लुक इनवर्ड्स एंड स्ट्रेंथन आवरसेल्व्स। उसके बाद वी कैन फेस द अवेल, देन देयर इज नो प्रॉब्लम। पाकिस्तान अगर मैं बात करूं जो तनाव है इस समय भारत और पाकिस्तान के बीच में। ये तनाव को लेकर अमेरिका के जो विदेश मंत्री हैं मार्को रूबी उनका कहना है कि ये जो सीज फायर है ये सस्टेन सस्टेनेबल नहीं है, लंबे समय तक नहीं टिक पाएगा। क्या भारत पाकिस्तान में इस तरह का कॉन्फ्लिक्ट आगे भी हो सकता है? देखिए जो रूबियो कह रहे हैं कि सीस फायर लंबे समय तक नहीं टिक पाएगा। उसके लिए उनकी जो नॉलेज ऑफ ये लड़ाई हुई क्यों? ये लड़ाई हुई क्योंकि पाकिस्तान ने पहलगाम में आतंकी हमला किया। और अगर वो सोचते हैं कि शीश फायर नहीं टिक पाएगा तो अगर पाकिस्तान दोबारा ऐसी हरकत करता है और इंडिया ने तो डिक्लेअर किया कि वी विल रिएक्ट। अगर पाकिस्तान दोबारा कोई टेररिस्ट की टेररिज्म की हरकत करता है तो इंडिया विल रिएक्ट बैक। दैट कैन बी कॉल्ड कि शीशफाई नहीं टिकराए। सो द वे यू सी इट। कश्मीर पर एक आखिरी सवाल मैं पूछना चाहूंगा कि भारत को कश्मीर में शांति स्थापना के लिए भारत ने बहुत सारे भारत सरकार ने बहुत सारे कदम उठाए हैं। आपको क्या लगता है पॉलिसी में और क्या एडिशंस किए जा सकते हैं?\n\nसकते हैं ताकि कश्मीर में एक फाइनल सॉल्यूशन जो है शांति का वो दिया जा सके। एनीवेयर इन द वर्ल्ड टेररिज्म या इंसिडेंसी हैज़ नेवर बीन पुट डाउन बाय द गन। द मिलिट्री और द गन कैन ओनली ब्रिंग इट डाउन टू अ लेवल वेयर द नेगोशिएशंस कैन हैपन एंड पीपल कैन कम एंड स्टार्ट टॉकिंग। अल्टीमेटली इट इज द इकोनॉमिक्स व्हिच ड्राइव्स द पीस। अगर इकोनॉमिक्स सही है, अगर वहां पे कश्मीर के हर घर में शाम को अच्छा खाना बनता है, अच्छी नौकरी है, अच्छी एजुकेशन है, अच्छी हेल्थ सिस्टम्स हैं, देन व्हाई वुड एनीवन पिक अप अ गन? बिल्कुल। क्योंकि वो चीज नहीं थी और इसलिए वो बॉयज कुड बी रेडिकलाइज्ड एंड यू नो टेकन टू डिफरेंट साइड। अभी जब मेन जो एम्फेसिस है वो इन बेसिक नीड्स पे होना चाहिए, एजुकेशन सिस्टम को इम्प्रूव करो। हेल्थ सैनिटेशन उसको इम्प्रूव करो, जॉब क्रिएशन एंड हायर एजुकेशन। वंस दीज़ थिंग्स हैपन, द प्रॉब्लम विल गेट रिसोल्वड ऑन इट्स ओन बिकॉज़ इट्स अ साइकिल। एंड ये हो रहा है। आज की तारीख पे जितनी भी फ्लाइट्स जा रही थी बिफोर पेलगाम, दे आर गोइंग 100% फुल। होटल ऑक्यूपेंसी वाज 100%। एटीएम कैश डिस्पेंसेशन वाज ट्रमेंडस। और यही पाकिस्तान को हजम नहीं हुई। यही पाकिस्तान को हजम नहीं हो रहा था। क्योंकि वहां पे तो जैसे मैं पहले बोला गुरबत है वहां तो। वहां तो हुकुमतान बोल रहे हैं कि एक टाइम का खाना बंद कर दो। पाकिस्तान के रुपए का डॉलर के अगेंस्ट देखिए वैल्यू क्या है आज। उनके वहां पे दालचीनी, सब्जी, पेट्रोल, डीजल उसकी कीमतें देखिए। बिजली के बिल देखिए उनके। तो इट्स गुड थिंग दैट वी आर इन अ इंटरनेट सोसाइटेशन एज नाउ। एटलीस्ट यू कम टू नो एक दूसरे देश में क्या हो रहा है। और हम ये भी देखते हैं कि पाकिस्तान ऑक्यूपाइड कश्मीर में लगातार जो है प्रोटेस्ट होते रहते हैं। और इन प्रोटेस्ट को देख के ऐसा लगता है कि पीओके के जो लोग हैं, वो भी कहीं ना कहीं चाहते होंगे कि पीओके के लोग आर जस्ट नॉट हैप्पी विद पाकिस्तानी, पंजाबी, मुसलमान। Pakistani Society is dominated by Punjabi Pakistani Muslim. And no POK citizen that is Kashmiri wants them. No Gilgit Baltistan citizen wants them. दैट्स व्हाई दी प्रोटेस्ट आर देयर। दे वांट टू मेंटेन देयर इंडिविजुअल आइडेंटिटी। एंड वो जब देखते हैं कि इंडिया में इतनी तरक्की हो रही है, हमारे यहां पे इतनी गरीबी है। सो दिस प्रोटेस्ट इज नेचुरल। नियर फ्यूचर में आप पीओके को भारत में मिलता देख रहे हैं। क्योंकि हर चीज का एक समय होता है। तो जब वो समय आएगा तो जरूर और इट्स अ इट्स अ डिक्लेरेशन ऑफ आवर पार्लियामेंट। हमारे पार्लियामेंट का रेजोल्यूशन है। पीओके इज पार्ट ऑफ इंडिया एंड वी विल टेक इट बैक। वी विल टेक इट बैक। अच्छा हमारी ऑडियंस को ऑपरेशन मां क्यों देखनी चाहिए एक बार दर्शकों को आप डायरेक्ट प्रेशिप क्या देना चाहेंगे? देखिए हम एक ऐसे एरिया से या ऐसे सबकॉन्टिनेंट में रहते हैं जहां पे फैमिली वैल्यूज का बहुत महत्व है। हमारे परिवार में लोग आपने देखा होगा ये बोलते हैं कि तेरे दादाजी तो गांव के सरपंच थे, नंबरदार थे, तू ये कैसे कर रहा है? वी हैव टू लिव अप टू द एक्सपेक्टेशंस ऑफ द सोसाइटी, द फैमिली नॉर्म्स एंड दैट इज एक्जेक्टली व्हाट ऑपरेशन मां इज ऑल अबाउट। ऑपरेशन मां टेल्स यू बाहर घर के किसी का भी नेम प्लेट पे बोर्ड पे नाम लिखा हो। घर के अंदर मां डिसाइड करती है कि आज खाने में क्या बनेगा, बच्चा कौन से स्कूल में जाएगा, बच्चा क्या कपड़े पहनेगा, कैसे घर चलेगा। सो मदर इज अ वेरी सेंट्रल फिगर इन आवर सोसाइटी। एवरी सोसाइटी मादर रोल इज वेरी इंपोर्टेंट, बट इन आवर सोसाइटी इट इज एब्सोल्युटली इंपोर्टेंट बिकॉज़ वी हैव अ वेरी क्लोज निट सोसाइटी, क्लोज निट फैमिली वैल्यूज।\nहम तो पूरे विश्व को एक कुटुंब मानते हैं।\nएंड दैट इज द रीज़न एंड दैट वाज द थीम ऑफ ऑपरेशन मां टू यू नो टेक द थिंग वेयर इट बिलोंग्स। एक लड़का है वो अपनी मदर के पास ही बिलोंग करता है, उसको वापस अपनी मदर के पास जाना है, जाना चाहिए। नो सन शुड बी विदाउट अ मदर एंड नो मदर शुड बी विदाउट अ सन। दैट वाज द बेसिक थीम ऑफ़ ऑपरेशन माँ। एंड प्लीज वॉच दिस डॉक्यूमेंट्री। इट्स अ वेरी वेल मेड डॉक्यूमेंट्री। आई कैन वाउ फॉर इट। व्हाइल सीइंग इट, आई हैड गुजबॉन्स। एंड आई एम श्योर यू विल एन्जॉय इट। इट्स रिलीजिंग इन ऑन डोकुबे ऑन 27th ऑफ़ अगस्त। मार्क द डेट एंड व्हेन आई विल गेट टाइम प्लीज वॉच दिस डॉक्यूमेंट्री, मेक श्योर योर चिल्ड्रन वॉच दिस डॉक्यूमेंट्री। इट्स एन एक्सेप्शनल पीस ऑफ़ आर्ट। ऑल द वेरी बेस्ट।\nथैंक यू।\nजय हिंद।\nथैंक यू सो मच फॉर जॉइनिंग  टीवी9 भारतवर्ष में आया आपने समय दिया और बिल्कुल जिस तरह से ढिल्लों साहब ने कहा कि आप 27th अगस्त को डॉक्यू वे पे ये डॉक्यूमेंट्री बिल्कुल जरूर देखें और खबरों के लिए आप टीवी9 भारतवर्ष देखते रहिए।\nधन्यवाद।\nथैंक यू एंड जय हिंद।	\N	2025-11-27 06:55:45.351198	uploaded	f	\N
34	go.teamchai@gmail.com	typed_text_1768282989416.txt	typed_text_1768282989416.txt	how	\N	2026-01-13 05:43:09.468737	uploaded	t	2026-01-13 05:43:09.529212
33	go.teamchai@gmail.com	typed_text_1768220550138.txt	typed_text_1768220550138.txt	how are you	\N	2026-01-12 12:22:30.492501	uploaded	t	2026-01-13 07:03:21.716903
35	go.teamchai@gmail.com	mp3_44100Hz_320kbps_stereo.mp3_transcription.txt	mp3_44100Hz_320kbps_stereo.mp3_transcription.txt	You are listening to a sample MP3 audio file provided by samplefiles.com.	\N	2026-01-13 05:44:10.790003	uploaded	t	2026-01-13 07:01:55.700652
\.


--
-- TOC entry 5038 (class 0 OID 33262)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, email, dob, contactno, place, city, state, pincode, gender, password, account_created_at, role, status, password_reset_requested, is_active) FROM stdin;
14	admin	main	admin@gmail.com	2000-01-01	917777744444	chennai	chennai	Tamilnadu	600028	male	$2b$12$e5re6CZLrnLwxhLvs4B/ROccf4zzJtuOb.0XLzUpsNcPNF00L67fm	2025-09-08 05:37:31.195346	admin	Active	\N	t
9	chai	admin	go.teamchai@gmail.com	2010-01-01	919876543210	chennai	chennai	Tamilnadu	600028	other	$2b$12$Pzh.4RZH.sqMivJjqii7LenY0Xsmiu3YbAmLj.eBcqipToz/LIsKe	2025-07-26 13:01:16.864266	admin	Active	\N	t
18	Test	User	test@example.com	\N	\N	\N	\N	\N	\N	\N	$2b$12$7Y4GHKDKLYADMaH/lNGTVucl00s6lVWRPXFV7InhG4Nwv.rwdWsVe	2026-01-12 07:09:52.71066	admin	Pending	\N	t
\.


--
-- TOC entry 5053 (class 0 OID 83011)
-- Dependencies: 233
-- Data for Name: video_task_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video_task_assignments (id, user_email, video_filename, video_path, assigned_by, assigned_at, status, completed_at, extracted_text, shared_with_admin, shared_at) FROM stdin;
13	admin@gmail.com	2 Win-deh.mp4	E:\\IITM-Office\\speech-app\\back_end\\uploads\\admin@gmail.com\\2 Win-deh.mp4	admin@gmail.com	2025-09-11 10:31:42.149263	completed	2025-09-11 10:32:51.036413	Transcription failed: [WinError 2] The system cannot find the file specified	f	\N
\.


--
-- TOC entry 5065 (class 0 OID 287789)
-- Dependencies: 245
-- Data for Name: video_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.video_tasks (id, user_email, video_filename, video_path, extracted_text, status, language, shared_with_admin, error_message, created_at, processed_at) FROM stdin;
\.


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 242
-- Name: audio_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audio_files_id_seq', 13, true);


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 236
-- Name: audio_transcriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audio_transcriptions_id_seq', 25, true);


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 234
-- Name: bulk_uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bulk_uploads_id_seq', 50, true);


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 230
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 9, true);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 221
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 55, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 224
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 10, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 219
-- Name: recordings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recordings_id_seq', 85, true);


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 226
-- Name: sentences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sentences_id_seq', 1, false);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 228
-- Name: task_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_assignments_id_seq', 25, true);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 240
-- Name: tts_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tts_records_id_seq', 18, true);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 238
-- Name: tts_uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tts_uploads_id_seq', 35, true);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 232
-- Name: video_task_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_task_assignments_id_seq', 13, true);


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 244
-- Name: video_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.video_tasks_id_seq', 1, false);


--
-- TOC entry 4847 (class 2606 OID 33359)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 4886 (class 2606 OID 279611)
-- Name: audio_files audio_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audio_files
    ADD CONSTRAINT audio_files_pkey PRIMARY KEY (id);


--
-- TOC entry 4874 (class 2606 OID 183406)
-- Name: audio_transcriptions audio_transcriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audio_transcriptions
    ADD CONSTRAINT audio_transcriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 83029)
-- Name: bulk_uploads bulk_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bulk_uploads
    ADD CONSTRAINT bulk_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 68065)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 33337)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4851 (class 2606 OID 33370)
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4853 (class 2606 OID 33372)
-- Name: password_reset_tokens password_reset_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_token_key UNIQUE (token);


--
-- TOC entry 4841 (class 2606 OID 33281)
-- Name: recordings recordings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordings
    ADD CONSTRAINT recordings_pkey PRIMARY KEY (id);


--
-- TOC entry 4856 (class 2606 OID 33439)
-- Name: sentences sentences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sentences
    ADD CONSTRAINT sentences_pkey PRIMARY KEY (id);


--
-- TOC entry 4861 (class 2606 OID 68052)
-- Name: task_assignments task_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignments
    ADD CONSTRAINT task_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4884 (class 2606 OID 183433)
-- Name: tts_records tts_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_records
    ADD CONSTRAINT tts_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 2606 OID 183422)
-- Name: tts_uploads tts_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tts_uploads
    ADD CONSTRAINT tts_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 33270)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 2606 OID 83018)
-- Name: video_task_assignments video_task_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_task_assignments
    ADD CONSTRAINT video_task_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 287796)
-- Name: video_tasks video_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.video_tasks
    ADD CONSTRAINT video_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4887 (class 1259 OID 279617)
-- Name: ix_audio_files_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_audio_files_id ON public.audio_files USING btree (id);


--
-- TOC entry 4875 (class 1259 OID 183408)
-- Name: ix_audio_transcriptions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_audio_transcriptions_id ON public.audio_transcriptions USING btree (id);


--
-- TOC entry 4876 (class 1259 OID 183407)
-- Name: ix_audio_transcriptions_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_audio_transcriptions_user_email ON public.audio_transcriptions USING btree (user_email);


--
-- TOC entry 4871 (class 1259 OID 83030)
-- Name: ix_bulk_uploads_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bulk_uploads_id ON public.bulk_uploads USING btree (id);


--
-- TOC entry 4872 (class 1259 OID 83031)
-- Name: ix_bulk_uploads_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bulk_uploads_user_email ON public.bulk_uploads USING btree (user_email);


--
-- TOC entry 4862 (class 1259 OID 68066)
-- Name: ix_logs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_logs_id ON public.logs USING btree (id);


--
-- TOC entry 4842 (class 1259 OID 33339)
-- Name: ix_notifications_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_notifications_id ON public.notifications USING btree (id);


--
-- TOC entry 4843 (class 1259 OID 33338)
-- Name: ix_notifications_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_notifications_username ON public.notifications USING btree (username);


--
-- TOC entry 4848 (class 1259 OID 33373)
-- Name: ix_password_reset_tokens_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_password_reset_tokens_email ON public.password_reset_tokens USING btree (email);


--
-- TOC entry 4849 (class 1259 OID 33374)
-- Name: ix_password_reset_tokens_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_password_reset_tokens_id ON public.password_reset_tokens USING btree (id);


--
-- TOC entry 4836 (class 1259 OID 33283)
-- Name: ix_recordings_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_recordings_id ON public.recordings USING btree (id);


--
-- TOC entry 4837 (class 1259 OID 33285)
-- Name: ix_recordings_language; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_recordings_language ON public.recordings USING btree (language);


--
-- TOC entry 4838 (class 1259 OID 33282)
-- Name: ix_recordings_sentence_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_recordings_sentence_number ON public.recordings USING btree (sentence_number);


--
-- TOC entry 4839 (class 1259 OID 33284)
-- Name: ix_recordings_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_recordings_username ON public.recordings USING btree (username);


--
-- TOC entry 4854 (class 1259 OID 33440)
-- Name: ix_sentences_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_sentences_id ON public.sentences USING btree (id);


--
-- TOC entry 4857 (class 1259 OID 68055)
-- Name: ix_task_assignments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_task_assignments_id ON public.task_assignments USING btree (id);


--
-- TOC entry 4858 (class 1259 OID 68054)
-- Name: ix_task_assignments_language; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_task_assignments_language ON public.task_assignments USING btree (language);


--
-- TOC entry 4859 (class 1259 OID 68053)
-- Name: ix_task_assignments_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_task_assignments_user_email ON public.task_assignments USING btree (user_email);


--
-- TOC entry 4881 (class 1259 OID 183434)
-- Name: ix_tts_records_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tts_records_id ON public.tts_records USING btree (id);


--
-- TOC entry 4882 (class 1259 OID 183435)
-- Name: ix_tts_records_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tts_records_user_email ON public.tts_records USING btree (user_email);


--
-- TOC entry 4877 (class 1259 OID 183424)
-- Name: ix_tts_uploads_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tts_uploads_id ON public.tts_uploads USING btree (id);


--
-- TOC entry 4878 (class 1259 OID 183423)
-- Name: ix_tts_uploads_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tts_uploads_user_email ON public.tts_uploads USING btree (user_email);


--
-- TOC entry 4832 (class 1259 OID 33360)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4833 (class 1259 OID 33361)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4865 (class 1259 OID 83020)
-- Name: ix_video_task_assignments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_video_task_assignments_id ON public.video_task_assignments USING btree (id);


--
-- TOC entry 4866 (class 1259 OID 83019)
-- Name: ix_video_task_assignments_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_video_task_assignments_user_email ON public.video_task_assignments USING btree (user_email);


--
-- TOC entry 4888 (class 1259 OID 287797)
-- Name: ix_video_tasks_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_video_tasks_id ON public.video_tasks USING btree (id);


--
-- TOC entry 4891 (class 2606 OID 279612)
-- Name: audio_files audio_files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audio_files
    ADD CONSTRAINT audio_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-01-14 13:20:58

--
-- PostgreSQL database dump complete
--

\unrestrict 3iUY7i8eHOX7GLyIqAV1kSo1GyxEKssXicUFoQctIhTyeaYhOSjyR8AYekFlfRa

