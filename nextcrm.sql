--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.7 (Ubuntu 14.7-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ActiveStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ActiveStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING'
);


ALTER TYPE public."ActiveStatus" OWNER TO postgres;

--
-- Name: DocumentSystemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocumentSystemType" AS ENUM (
    'INVOICE',
    'RECEIPT',
    'CONTRACT',
    'OFFER',
    'OTHER',
    'ID',
    'PASSPORT',
    'VISA',
    'INSURANCE',
    'HEALTH',
    'CERTIFICATE'
);


ALTER TYPE public."DocumentSystemType" OWNER TO postgres;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Language" AS ENUM (
    'de',
    'en'
);


ALTER TYPE public."Language" OWNER TO postgres;

--
-- Name: Modules; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Modules" AS ENUM (
    'admin',
    'crm',
    'documents',
    'projects',
    'secondbrain',
    'invoice',
    'allmodules'
);


ALTER TYPE public."Modules" OWNER TO postgres;

--
-- Name: crm_Contact_Type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Contact_Type" AS ENUM (
    'Customer',
    'Partner',
    'Vendor'
);


ALTER TYPE public."crm_Contact_Type" OWNER TO postgres;

--
-- Name: crm_Lead_Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Lead_Status" AS ENUM (
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'LOST'
);


ALTER TYPE public."crm_Lead_Status" OWNER TO postgres;

--
-- Name: crm_Lead_Type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Lead_Type" AS ENUM (
    'DEMO'
);


ALTER TYPE public."crm_Lead_Type" OWNER TO postgres;

--
-- Name: crm_Opportunity_Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."crm_Opportunity_Status" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'CLOSED'
);


ALTER TYPE public."crm_Opportunity_Status" OWNER TO postgres;

--
-- Name: gptStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."gptStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."gptStatus" OWNER TO postgres;

--
-- Name: taskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."taskStatus" AS ENUM (
    'ACTIVE',
    'PENDING',
    'COMPLETE'
);


ALTER TYPE public."taskStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Boards" (
    id text NOT NULL,
    description text NOT NULL,
    favourite boolean,
    "favouritePosition" integer,
    icon text,
    "position" integer,
    title text NOT NULL,
    "user" text NOT NULL,
    visibility text,
    date_created date DEFAULT CURRENT_TIMESTAMP,
    last_edited date
);


ALTER TABLE public."Boards" OWNER TO postgres;

--
-- Name: Documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documents" (
    id text NOT NULL,
    connected_documents text[],
    date_created date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_updated timestamp(3) without time zone,
    document_name text,
    created_by_user text,
    description text,
    document_type text,
    favourite boolean,
    "document_file_mimeType" text,
    document_file_url text,
    status text,
    visibility text,
    tags jsonb,
    key text,
    size integer,
    assigned_user text,
    account text,
    "invoiceIDs" text[],
    "tasksIDs" text[],
    document_system_type public."DocumentSystemType" DEFAULT 'OTHER'::public."DocumentSystemType",
    "opportunityIDs" text[],
    "contactsIDs" text[]
);


ALTER TABLE public."Documents" OWNER TO postgres;

--
-- Name: Documents_Types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Documents_Types" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Documents_Types" OWNER TO postgres;

--
-- Name: Employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Employees" (
    id text NOT NULL,
    avatar text NOT NULL,
    email text,
    name text NOT NULL,
    salary integer NOT NULL,
    status text NOT NULL
);


ALTER TABLE public."Employees" OWNER TO postgres;

--
-- Name: ImageUpload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ImageUpload" (
    id text NOT NULL
);


ALTER TABLE public."ImageUpload" OWNER TO postgres;

--
-- Name: Invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoices" (
    id text NOT NULL,
    date_created date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_updated timestamp(3) without time zone NOT NULL,
    last_updated_by text,
    date_received date DEFAULT CURRENT_TIMESTAMP,
    date_of_case date,
    date_tax date,
    date_due date,
    description text,
    document_type text,
    favorite boolean DEFAULT false,
    variable_symbol text,
    constant_symbol text,
    specific_symbol text,
    order_number text,
    internal_number text,
    invoice_number text,
    invoice_amount text,
    "invoice_file_mimeType" text NOT NULL,
    invoice_file_url text NOT NULL,
    invoice_items jsonb,
    invoice_type text,
    invoice_currency text,
    invoice_language text,
    partner text,
    partner_street text,
    partner_city text,
    partner_zip text,
    partner_country text,
    partner_country_code text,
    partner_business_street text,
    partner_business_city text,
    partner_business_zip text,
    partner_business_country text,
    partner_business_country_code text,
    "partner_VAT_number" text,
    "partner_TAX_number" text,
    "partner_TAX_local_number" text,
    partner_phone_prefix text,
    partner_phone_number text,
    partner_fax_prefix text,
    partner_fax_number text,
    partner_email text,
    partner_website text,
    partner_is_person boolean,
    partner_bank text,
    partner_account_number text,
    partner_account_bank_number text,
    "partner_IBAN" text,
    "partner_SWIFT" text,
    "partner_BIC" text,
    rossum_status text,
    rossum_annotation_id text,
    rossum_annotation_url text,
    rossum_document_id text,
    rossum_document_url text,
    rossum_annotation_json_url text,
    rossum_annotation_xml_url text,
    money_s3_url text,
    status text,
    invoice_state_id text,
    assigned_user_id text,
    assigned_account_id text,
    visibility boolean DEFAULT true NOT NULL,
    connected_documents text[]
);


ALTER TABLE public."Invoices" OWNER TO postgres;

--
-- Name: MyAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MyAccount" (
    id text NOT NULL,
    company_name text NOT NULL,
    is_person boolean DEFAULT false NOT NULL,
    email text,
    email_accountant text,
    phone_prefix text,
    phone text,
    mobile_prefix text,
    mobile text,
    fax_prefix text,
    fax text,
    website text,
    street text,
    city text,
    state text,
    zip text,
    country text,
    country_code text,
    billing_street text,
    billing_city text,
    billing_state text,
    billing_zip text,
    billing_country text,
    billing_country_code text,
    currency text,
    currency_symbol text,
    "VAT_number" text NOT NULL,
    "TAX_number" text,
    bank_name text,
    bank_account text,
    bank_code text,
    "bank_IBAN" text,
    "bank_SWIFT" text
);


ALTER TABLE public."MyAccount" OWNER TO postgres;

--
-- Name: Sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sections" (
    id text NOT NULL,
    board text NOT NULL,
    title text NOT NULL,
    "position" integer
);


ALTER TABLE public."Sections" OWNER TO postgres;

--
-- Name: Tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tasks" (
    id text NOT NULL,
    content text,
    "createdAt" date NOT NULL,
    "createdBy" text,
    "dueDateAt" date DEFAULT CURRENT_TIMESTAMP,
    "lastEditedAt" date DEFAULT CURRENT_TIMESTAMP,
    "position" integer NOT NULL,
    priority text NOT NULL,
    section text NOT NULL,
    tags jsonb,
    title text NOT NULL,
    "user" text,
    "documentIDs" text[],
    "taskStatus" public."taskStatus" DEFAULT 'ACTIVE'::public."taskStatus"
);


ALTER TABLE public."Tasks" OWNER TO postgres;

--
-- Name: TodoList; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TodoList" (
    id text NOT NULL,
    "createdAt" text NOT NULL,
    description text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    "user" text NOT NULL
);


ALTER TABLE public."TodoList" OWNER TO postgres;

--
-- Name: Translation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Translation" (
    id text NOT NULL,
    key text NOT NULL,
    language text NOT NULL,
    text text NOT NULL,
    module public."Modules" DEFAULT 'allmodules'::public."Modules" NOT NULL
);


ALTER TABLE public."Translation" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id text NOT NULL,
    account_name text,
    avatar text,
    email text NOT NULL,
    is_account_admin boolean DEFAULT false NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_on date DEFAULT CURRENT_TIMESTAMP,
    name text,
    password text,
    username text,
    "userStatus" public."ActiveStatus" DEFAULT 'PENDING'::public."ActiveStatus" NOT NULL,
    "userLanguage" public."Language" DEFAULT 'en'::public."Language" NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: _DocumentsToInvoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsToInvoices" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsToInvoices" OWNER TO postgres;

--
-- Name: _DocumentsToTasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsToTasks" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsToTasks" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Contacts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Contacts" OWNER TO postgres;

--
-- Name: _DocumentsTocrm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_DocumentsTocrm_Opportunities" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_DocumentsTocrm_Opportunities" OWNER TO postgres;

--
-- Name: _crm_AccountsTocrm_Contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_crm_AccountsTocrm_Contacts" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_crm_AccountsTocrm_Contacts" OWNER TO postgres;

--
-- Name: _crm_ContactsTocrm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_crm_ContactsTocrm_Opportunities" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_crm_ContactsTocrm_Opportunities" OWNER TO postgres;

--
-- Name: crm_Accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Accounts" (
    id text NOT NULL,
    annual_revenue text,
    assigned_to text,
    billing_city text,
    billing_country text,
    billing_postal_code text,
    billing_state text,
    billing_street text,
    company_id text,
    description text,
    email text,
    employees text,
    fax text,
    industry text,
    member_of text,
    name text NOT NULL,
    office_phone text,
    shipping_city text,
    shipping_country text,
    shipping_postal_code text,
    shipping_state text,
    shipping_street text,
    status text DEFAULT 'Inactive'::text,
    type text DEFAULT 'Customer'::text,
    vat text,
    website text,
    connected_contacts text[],
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text
);


ALTER TABLE public."crm_Accounts" OWNER TO postgres;

--
-- Name: crm_Contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Contacts" (
    id text NOT NULL,
    account text,
    assigned_to text,
    birthday text,
    created_by text NOT NULL,
    created_on timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity date DEFAULT CURRENT_TIMESTAMP,
    last_activity_by text,
    description text,
    email text,
    personal_email text,
    first_name text,
    last_name text NOT NULL,
    office_phone text,
    mobile_phone text,
    website text,
    "position" text,
    status boolean DEFAULT true NOT NULL,
    social_twitter text,
    social_facebook text,
    social_linkedin text,
    social_skype text,
    social_instagram text,
    social_youtube text,
    social_tiktok text,
    type text DEFAULT 'Customer'::text,
    "accountsIDs" text[],
    "opportunitiesIDs" text[],
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "documentsIDs" text[],
    "updatedAt" date,
    "updatedBy" text
);


ALTER TABLE public."crm_Contacts" OWNER TO postgres;

--
-- Name: crm_Industry_Type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Industry_Type" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."crm_Industry_Type" OWNER TO postgres;

--
-- Name: crm_Leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Leads" (
    id text NOT NULL,
    date_created date DEFAULT CURRENT_TIMESTAMP,
    date_modify date DEFAULT CURRENT_TIMESTAMP,
    last_activity_by text,
    "firstName" text,
    "lastName" text,
    company text,
    "jobTitle" text,
    email text,
    phone text,
    description text,
    lead_source text,
    refered_by text,
    campaign text,
    assigned_to text,
    status text DEFAULT 'NEW'::text,
    type text DEFAULT 'DEMO'::text
);


ALTER TABLE public."crm_Leads" OWNER TO postgres;

--
-- Name: crm_Opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities" (
    id text NOT NULL,
    account text,
    assigned_to text,
    budget text,
    campaign text,
    close_date date,
    contact text,
    created_by text,
    created_on date DEFAULT CURRENT_TIMESTAMP,
    last_activity date,
    last_activity_by text,
    currency text,
    description text,
    expected_revenue text,
    name text,
    next_step text,
    sales_stage text,
    type text,
    status public."crm_Opportunity_Status" DEFAULT 'ACTIVE'::public."crm_Opportunity_Status",
    connected_contacts text[],
    connected_documents text[],
    "createdAt" date DEFAULT CURRENT_TIMESTAMP,
    "createdBy" text,
    "updatedAt" date,
    "updatedBy" text
);


ALTER TABLE public."crm_Opportunities" OWNER TO postgres;

--
-- Name: crm_Opportunities_Sales_Stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities_Sales_Stages" (
    id text NOT NULL,
    name text NOT NULL,
    probability integer,
    "order" integer
);


ALTER TABLE public."crm_Opportunities_Sales_Stages" OWNER TO postgres;

--
-- Name: crm_Opportunities_Type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."crm_Opportunities_Type" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer
);


ALTER TABLE public."crm_Opportunities_Type" OWNER TO postgres;

--
-- Name: crm_campains; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_campains (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    status text
);


ALTER TABLE public.crm_campains OWNER TO postgres;

--
-- Name: gpt_models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gpt_models (
    id text NOT NULL,
    model text NOT NULL,
    description text,
    status public."gptStatus",
    created_on date DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.gpt_models OWNER TO postgres;

--
-- Name: invoice_States; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."invoice_States" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."invoice_States" OWNER TO postgres;

--
-- Name: modulStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."modulStatus" (
    id text NOT NULL,
    name text NOT NULL,
    "isVisible" boolean NOT NULL
);


ALTER TABLE public."modulStatus" OWNER TO postgres;

--
-- Name: secondBrain_notions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."secondBrain_notions" (
    id text NOT NULL,
    "user" text NOT NULL,
    notion_api_key text NOT NULL,
    notion_db_id text NOT NULL
);


ALTER TABLE public."secondBrain_notions" OWNER TO postgres;

--
-- Name: system_Modules_Enabled; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."system_Modules_Enabled" (
    id text NOT NULL,
    name text NOT NULL,
    enabled boolean NOT NULL,
    icon text NOT NULL,
    open text NOT NULL,
    route text NOT NULL,
    "menuItem" text NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE public."system_Modules_Enabled" OWNER TO postgres;

--
-- Name: tasksComments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."tasksComments" (
    id text NOT NULL,
    comment text NOT NULL,
    "createdAt" date NOT NULL,
    task text NOT NULL,
    "user" text NOT NULL
);


ALTER TABLE public."tasksComments" OWNER TO postgres;

--
-- Data for Name: Boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Boards" (id, description, favourite, "favouritePosition", icon, "position", title, "user", visibility, date_created, last_edited) FROM stdin;
\.


--
-- Data for Name: Documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documents" (id, connected_documents, date_created, last_updated, document_name, created_by_user, description, document_type, favourite, "document_file_mimeType", document_file_url, status, visibility, tags, key, size, assigned_user, account, "invoiceIDs", "tasksIDs", document_system_type, "opportunityIDs", "contactsIDs") FROM stdin;
\.


--
-- Data for Name: Documents_Types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Documents_Types" (id, name) FROM stdin;
\.


--
-- Data for Name: Employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Employees" (id, avatar, email, name, salary, status) FROM stdin;
\.


--
-- Data for Name: ImageUpload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ImageUpload" (id) FROM stdin;
\.


--
-- Data for Name: Invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoices" (id, date_created, last_updated, last_updated_by, date_received, date_of_case, date_tax, date_due, description, document_type, favorite, variable_symbol, constant_symbol, specific_symbol, order_number, internal_number, invoice_number, invoice_amount, "invoice_file_mimeType", invoice_file_url, invoice_items, invoice_type, invoice_currency, invoice_language, partner, partner_street, partner_city, partner_zip, partner_country, partner_country_code, partner_business_street, partner_business_city, partner_business_zip, partner_business_country, partner_business_country_code, "partner_VAT_number", "partner_TAX_number", "partner_TAX_local_number", partner_phone_prefix, partner_phone_number, partner_fax_prefix, partner_fax_number, partner_email, partner_website, partner_is_person, partner_bank, partner_account_number, partner_account_bank_number, "partner_IBAN", "partner_SWIFT", "partner_BIC", rossum_status, rossum_annotation_id, rossum_annotation_url, rossum_document_id, rossum_document_url, rossum_annotation_json_url, rossum_annotation_xml_url, money_s3_url, status, invoice_state_id, assigned_user_id, assigned_account_id, visibility, connected_documents) FROM stdin;
\.


--
-- Data for Name: MyAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MyAccount" (id, company_name, is_person, email, email_accountant, phone_prefix, phone, mobile_prefix, mobile, fax_prefix, fax, website, street, city, state, zip, country, country_code, billing_street, billing_city, billing_state, billing_zip, billing_country, billing_country_code, currency, currency_symbol, "VAT_number", "TAX_number", bank_name, bank_account, bank_code, "bank_IBAN", "bank_SWIFT") FROM stdin;
\.


--
-- Data for Name: Sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sections" (id, board, title, "position") FROM stdin;
\.


--
-- Data for Name: Tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tasks" (id, content, "createdAt", "createdBy", "dueDateAt", "lastEditedAt", "position", priority, section, tags, title, "user", "documentIDs", "taskStatus") FROM stdin;
\.


--
-- Data for Name: TodoList; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TodoList" (id, "createdAt", description, title, url, "user") FROM stdin;
\.


--
-- Data for Name: Translation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Translation" (id, key, language, text, module) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, account_name, avatar, email, is_account_admin, is_admin, created_on, name, password, username, "userStatus", "userLanguage") FROM stdin;
cllgvu9ry0000mmo645sbanhe	Shells		kubeworkz@gmail.com	t	t	2023-08-18	Dave Cook	$2a$12$EuWqtbbhoxX.luyJx48/x.8baxBaqsEZ3bOmH37iEG7aqNpC9CJPW	quasimotoca	ACTIVE	en
clllcyfzm0000mmacstae8tdp	\N	https://avatars.githubusercontent.com/u/140992652?v=4	saashqdev@gmail.com	f	f	2023-08-21	SaashqDev	\N	\N	ACTIVE	en
\.


--
-- Data for Name: _DocumentsToInvoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsToInvoices" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsToTasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsToTasks" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Contacts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _DocumentsTocrm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_DocumentsTocrm_Opportunities" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _crm_AccountsTocrm_Contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_crm_AccountsTocrm_Contacts" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _crm_ContactsTocrm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_crm_ContactsTocrm_Opportunities" ("A", "B") FROM stdin;
\.


--
-- Data for Name: crm_Accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Accounts" (id, annual_revenue, assigned_to, billing_city, billing_country, billing_postal_code, billing_state, billing_street, company_id, description, email, employees, fax, industry, member_of, name, office_phone, shipping_city, shipping_country, shipping_postal_code, shipping_state, shipping_street, status, type, vat, website, connected_contacts, "createdAt", "createdBy", "updatedAt", "updatedBy") FROM stdin;
\.


--
-- Data for Name: crm_Contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Contacts" (id, account, assigned_to, birthday, created_by, created_on, last_activity, last_activity_by, description, email, personal_email, first_name, last_name, office_phone, mobile_phone, website, "position", status, social_twitter, social_facebook, social_linkedin, social_skype, social_instagram, social_youtube, social_tiktok, type, "accountsIDs", "opportunitiesIDs", "createdAt", "createdBy", "documentsIDs", "updatedAt", "updatedBy") FROM stdin;
\.


--
-- Data for Name: crm_Industry_Type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Industry_Type" (id, name) FROM stdin;
e47846c8-d906-468f-9081-61e410018f12	Food Industry
676035e3-b44d-4647-b589-5286437e2c12	Construction
dc0a6f2b-361b-4b37-b649-d3098ebaea48	Transportation
a8baf879-fcd1-4549-ae8c-c467fee56a8e	Health care
662a0462-4138-4b21-a472-9d85c3c6395e	Mining
428fc3d2-3f6b-402f-afa6-f319dedf25fa	Real Estate
1e48a037-466b-4c1d-8875-77386b79486d	Entertainment
2c4cf6c7-ed7c-45c4-bc14-afad9ef3246f	Hospitality Industry
64014539-09b5-4bd9-97c2-4d6d40f2b81a	Financial Services
45cd5f61-eb8f-41cf-a1d7-774fc728e8f4	Telecommunications
2776bd73-3da9-40a8-be4e-9a3b3b73d684	Retail
f24440f7-a3b7-4e43-84e0-b0230fc33333	Energy Industry
d504952f-246f-4285-b871-58a7b9b4fdd9	Information Technology
b5c6902d-f8a9-48e6-8689-f84e0078976c	Automobile Engineering
8a09d680-f9a9-48a1-b905-40589b8c5a49	Petroleum Industry
6c9e4f27-73a7-460f-8aea-bac3e1fb07c9	Tourism
b5402a07-774d-4140-8213-25470186a020	Finance
714bb350-c72b-46ab-b68d-3aac727bf9f0	Forestry
3719170c-5a3a-4f1b-9c40-a6927f3b964e	Media
4d4dfdaf-4638-43e8-bf12-d405d282f9dc	Biotechnology
\.


--
-- Data for Name: crm_Leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Leads" (id, date_created, date_modify, last_activity_by, "firstName", "lastName", company, "jobTitle", email, phone, description, lead_source, refered_by, campaign, assigned_to, status, type) FROM stdin;
\.


--
-- Data for Name: crm_Opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities" (id, account, assigned_to, budget, campaign, close_date, contact, created_by, created_on, last_activity, last_activity_by, currency, description, expected_revenue, name, next_step, sales_stage, type, status, connected_contacts, connected_documents, "createdAt", "createdBy", "updatedAt", "updatedBy") FROM stdin;
\.


--
-- Data for Name: crm_Opportunities_Sales_Stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities_Sales_Stages" (id, name, probability, "order") FROM stdin;
947f9471-4f26-4438-b995-bb925bcd7c59	New	10	0
94b2fbe7-a4bd-4df1-a14c-82901f251e5f	Needs analysis	25	0
6f954429-82c0-49c8-8c5e-27bfa3c2168f	Signing	95	\N
661a2611-f12e-44d0-8973-57e36e86cca1	Offer sent	30	\N
743dc79f-587e-4533-af04-1314db426024	Offer accepted	45	\N
4930392a-9b0f-4636-ba88-53abef3aace1	Contract draft	65	\N
d14beffe-12e0-4f68-886f-2611bc9be10b	Contract negotiation	75	\N
2e1fd912-f143-4bcb-9b13-b39ab48f4ba2	Send for signing	80	\N
18bac361-86d6-4230-96e7-72992408066e	Realization of the project	100	\N
\.


--
-- Data for Name: crm_Opportunities_Type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."crm_Opportunities_Type" (id, name, "order") FROM stdin;
10904e7b-0e7b-4497-945f-ed33fbb7e4de	Business from partners	2
cf835196-db24-4847-aeca-a3f0f1feadd0	Upsale	3
0d702156-0ca1-4a20-ba75-8467d1846613	New deal	1
9be121e2-96d7-4bd5-99d4-7eede1440682	Cross sale	4
\.


--
-- Data for Name: crm_campains; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_campains (id, name, description, status) FROM stdin;
562486b9-8cba-40ac-b721-b5b244801b6b	Social networks	Instagram, Facebook, Twitter	ACTIVE
a778ff93-6550-4aca-bbf7-5dd7309fbe96	Cold calls	Our call center	\N
\.


--
-- Data for Name: gpt_models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gpt_models (id, model, description, status, created_on) FROM stdin;
\.


--
-- Data for Name: invoice_States; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."invoice_States" (id, name) FROM stdin;
\.


--
-- Data for Name: modulStatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."modulStatus" (id, name, "isVisible") FROM stdin;
\.


--
-- Data for Name: secondBrain_notions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."secondBrain_notions" (id, "user", notion_api_key, notion_db_id) FROM stdin;
cllk98n2c0001mmkngll6ujml	cllgvu9ry0000mmo645sbanhe	secret_43USxMhN8wSeN5H8n3QjReSe293uMTduJnodTB4efH6	848df94684fd478596deeb698527c209
\.


--
-- Data for Name: system_Modules_Enabled; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."system_Modules_Enabled" (id, name, enabled, icon, open, route, "menuItem", "position") FROM stdin;
e80da029-3f9a-41ea-af98-55f875888682	crm\n	t	userGroup	open	/crm	CRM	1
21c29fac-bf6e-4b86-9230-84d6cef779d3	projects	t	server	open	/projects	Projects	2
1d519431-494d-42c7-a0bb-c7cddd70855a	secondBrain	t	lightBulb	open	/secondBrain	SecondBrain	3
0ac58623-4196-4b26-a151-1d9abe631595	employee	t	user	open	/employees	Employees	4
8673a80c-37f8-40e8-aa83-99b9c51d1535	invoice	t	documentCheck	open	/invoice	Invoices	5
1808c39f-17bb-4f4f-a8fa-14d916c8e946	reports	t	documentChart	open	/reports	Reports	6
047026e6-736c-42c6-a90a-982a322c31e6	documents	t	document	open	/documents	Documents	7
a5d6a138-b048-48eb-85d9-88a80635e371	databox	f	clipBoardDocument	open	/databox	Databoxes	8
d8b47c7a-958b-498d-89e3-3d8907e73cab	openai	t	academicCap	open	/openAi	ChatGPT	10
\.


--
-- Data for Name: tasksComments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."tasksComments" (id, comment, "createdAt", task, "user") FROM stdin;
\.


--
-- Name: Boards Boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_pkey" PRIMARY KEY (id);


--
-- Name: Documents_Types Documents_Types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents_Types"
    ADD CONSTRAINT "Documents_Types_pkey" PRIMARY KEY (id);


--
-- Name: Documents Documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_pkey" PRIMARY KEY (id);


--
-- Name: Employees Employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Employees"
    ADD CONSTRAINT "Employees_pkey" PRIMARY KEY (id);


--
-- Name: ImageUpload ImageUpload_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ImageUpload"
    ADD CONSTRAINT "ImageUpload_pkey" PRIMARY KEY (id);


--
-- Name: Invoices Invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_pkey" PRIMARY KEY (id);


--
-- Name: MyAccount MyAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MyAccount"
    ADD CONSTRAINT "MyAccount_pkey" PRIMARY KEY (id);


--
-- Name: Sections Sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sections"
    ADD CONSTRAINT "Sections_pkey" PRIMARY KEY (id);


--
-- Name: Tasks Tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY (id);


--
-- Name: TodoList TodoList_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TodoList"
    ADD CONSTRAINT "TodoList_pkey" PRIMARY KEY (id);


--
-- Name: Translation Translation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Translation"
    ADD CONSTRAINT "Translation_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: crm_Accounts crm_Accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_pkey" PRIMARY KEY (id);


--
-- Name: crm_Contacts crm_Contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_pkey" PRIMARY KEY (id);


--
-- Name: crm_Industry_Type crm_Industry_Type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Industry_Type"
    ADD CONSTRAINT "crm_Industry_Type_pkey" PRIMARY KEY (id);


--
-- Name: crm_Leads crm_Leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Leads"
    ADD CONSTRAINT "crm_Leads_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities_Sales_Stages crm_Opportunities_Sales_Stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities_Sales_Stages"
    ADD CONSTRAINT "crm_Opportunities_Sales_Stages_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities_Type crm_Opportunities_Type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities_Type"
    ADD CONSTRAINT "crm_Opportunities_Type_pkey" PRIMARY KEY (id);


--
-- Name: crm_Opportunities crm_Opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_pkey" PRIMARY KEY (id);


--
-- Name: crm_campains crm_campains_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_campains
    ADD CONSTRAINT crm_campains_pkey PRIMARY KEY (id);


--
-- Name: gpt_models gpt_models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gpt_models
    ADD CONSTRAINT gpt_models_pkey PRIMARY KEY (id);


--
-- Name: invoice_States invoice_States_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."invoice_States"
    ADD CONSTRAINT "invoice_States_pkey" PRIMARY KEY (id);


--
-- Name: modulStatus modulStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."modulStatus"
    ADD CONSTRAINT "modulStatus_pkey" PRIMARY KEY (id);


--
-- Name: secondBrain_notions secondBrain_notions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."secondBrain_notions"
    ADD CONSTRAINT "secondBrain_notions_pkey" PRIMARY KEY (id);


--
-- Name: system_Modules_Enabled system_Modules_Enabled_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."system_Modules_Enabled"
    ADD CONSTRAINT "system_Modules_Enabled_pkey" PRIMARY KEY (id);


--
-- Name: tasksComments tasksComments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_pkey" PRIMARY KEY (id);


--
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- Name: _DocumentsToInvoices_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsToInvoices_AB_unique" ON public."_DocumentsToInvoices" USING btree ("A", "B");


--
-- Name: _DocumentsToInvoices_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsToInvoices_B_index" ON public."_DocumentsToInvoices" USING btree ("B");


--
-- Name: _DocumentsToTasks_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsToTasks_AB_unique" ON public."_DocumentsToTasks" USING btree ("A", "B");


--
-- Name: _DocumentsToTasks_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsToTasks_B_index" ON public."_DocumentsToTasks" USING btree ("B");


--
-- Name: _DocumentsTocrm_Contacts_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Contacts_AB_unique" ON public."_DocumentsTocrm_Contacts" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Contacts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Contacts_B_index" ON public."_DocumentsTocrm_Contacts" USING btree ("B");


--
-- Name: _DocumentsTocrm_Opportunities_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_DocumentsTocrm_Opportunities_AB_unique" ON public."_DocumentsTocrm_Opportunities" USING btree ("A", "B");


--
-- Name: _DocumentsTocrm_Opportunities_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_DocumentsTocrm_Opportunities_B_index" ON public."_DocumentsTocrm_Opportunities" USING btree ("B");


--
-- Name: _crm_AccountsTocrm_Contacts_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_crm_AccountsTocrm_Contacts_AB_unique" ON public."_crm_AccountsTocrm_Contacts" USING btree ("A", "B");


--
-- Name: _crm_AccountsTocrm_Contacts_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_crm_AccountsTocrm_Contacts_B_index" ON public."_crm_AccountsTocrm_Contacts" USING btree ("B");


--
-- Name: _crm_ContactsTocrm_Opportunities_AB_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "_crm_ContactsTocrm_Opportunities_AB_unique" ON public."_crm_ContactsTocrm_Opportunities" USING btree ("A", "B");


--
-- Name: _crm_ContactsTocrm_Opportunities_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_crm_ContactsTocrm_Opportunities_B_index" ON public."_crm_ContactsTocrm_Opportunities" USING btree ("B");


--
-- Name: Boards Boards_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Boards"
    ADD CONSTRAINT "Boards_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Documents Documents_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_account_fkey" FOREIGN KEY (account) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_assigned_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_assigned_user_fkey" FOREIGN KEY (assigned_user) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_created_by_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_created_by_user_fkey" FOREIGN KEY (created_by_user) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_document_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_document_type_fkey" FOREIGN KEY (document_type) REFERENCES public."Documents_Types"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_assigned_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_assigned_account_id_fkey" FOREIGN KEY (assigned_account_id) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_assigned_user_id_fkey" FOREIGN KEY (assigned_user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoices Invoices_invoice_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_invoice_state_id_fkey" FOREIGN KEY (invoice_state_id) REFERENCES public."invoice_States"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tasks Tasks_section_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_section_fkey" FOREIGN KEY (section) REFERENCES public."Sections"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tasks Tasks_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tasks"
    ADD CONSTRAINT "Tasks_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _DocumentsToInvoices _DocumentsToInvoices_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToInvoices"
    ADD CONSTRAINT "_DocumentsToInvoices_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToInvoices _DocumentsToInvoices_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToInvoices"
    ADD CONSTRAINT "_DocumentsToInvoices_B_fkey" FOREIGN KEY ("B") REFERENCES public."Invoices"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToTasks _DocumentsToTasks_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToTasks"
    ADD CONSTRAINT "_DocumentsToTasks_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsToTasks _DocumentsToTasks_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsToTasks"
    ADD CONSTRAINT "_DocumentsToTasks_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tasks"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Contacts _DocumentsTocrm_Contacts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Contacts"
    ADD CONSTRAINT "_DocumentsTocrm_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Contacts _DocumentsTocrm_Contacts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Contacts"
    ADD CONSTRAINT "_DocumentsTocrm_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Opportunities _DocumentsTocrm_Opportunities_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Opportunities"
    ADD CONSTRAINT "_DocumentsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES public."Documents"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _DocumentsTocrm_Opportunities _DocumentsTocrm_Opportunities_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_DocumentsTocrm_Opportunities"
    ADD CONSTRAINT "_DocumentsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Opportunities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_AccountsTocrm_Contacts _crm_AccountsTocrm_Contacts_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_AccountsTocrm_Contacts"
    ADD CONSTRAINT "_crm_AccountsTocrm_Contacts_A_fkey" FOREIGN KEY ("A") REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_AccountsTocrm_Contacts _crm_AccountsTocrm_Contacts_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_AccountsTocrm_Contacts"
    ADD CONSTRAINT "_crm_AccountsTocrm_Contacts_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_ContactsTocrm_Opportunities _crm_ContactsTocrm_Opportunities_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_ContactsTocrm_Opportunities"
    ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_A_fkey" FOREIGN KEY ("A") REFERENCES public."crm_Contacts"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _crm_ContactsTocrm_Opportunities _crm_ContactsTocrm_Opportunities_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_crm_ContactsTocrm_Opportunities"
    ADD CONSTRAINT "_crm_ContactsTocrm_Opportunities_B_fkey" FOREIGN KEY ("B") REFERENCES public."crm_Opportunities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: crm_Accounts crm_Accounts_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Accounts crm_Accounts_industry_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Accounts"
    ADD CONSTRAINT "crm_Accounts_industry_fkey" FOREIGN KEY (industry) REFERENCES public."crm_Industry_Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Contacts crm_Contacts_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Contacts crm_Contacts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Contacts"
    ADD CONSTRAINT "crm_Contacts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: crm_Leads crm_Leads_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Leads"
    ADD CONSTRAINT "crm_Leads_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_account_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_account_fkey" FOREIGN KEY (account) REFERENCES public."crm_Accounts"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_campaign_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_campaign_fkey" FOREIGN KEY (campaign) REFERENCES public.crm_campains(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_sales_stage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_sales_stage_fkey" FOREIGN KEY (sales_stage) REFERENCES public."crm_Opportunities_Sales_Stages"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: crm_Opportunities crm_Opportunities_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."crm_Opportunities"
    ADD CONSTRAINT "crm_Opportunities_type_fkey" FOREIGN KEY (type) REFERENCES public."crm_Opportunities_Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: secondBrain_notions secondBrain_notions_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."secondBrain_notions"
    ADD CONSTRAINT "secondBrain_notions_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tasksComments tasksComments_task_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_task_fkey" FOREIGN KEY (task) REFERENCES public."Tasks"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: tasksComments tasksComments_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."tasksComments"
    ADD CONSTRAINT "tasksComments_user_fkey" FOREIGN KEY ("user") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

