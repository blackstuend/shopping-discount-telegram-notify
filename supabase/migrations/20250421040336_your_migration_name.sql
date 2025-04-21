create type "public"."platform_type" as enum ('pchome', 'momo');

create sequence "public"."products_id_seq";

create table "public"."products" (
    "id" integer not null default nextval('products_id_seq'::regclass),
    "chatId" integer not null,
    "name" text not null,
    "price" numeric not null,
    "platforms" platform_type[] not null
);


alter table "public"."products" enable row level security;

alter sequence "public"."products_id_seq" owned by "public"."products"."id";

CREATE INDEX idx_products_chat_id ON public.products USING btree ("chatId");

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."products" add constraint "platforms_not_empty" CHECK ((array_length(platforms, 1) > 0)) not valid;

alter table "public"."products" validate constraint "platforms_not_empty";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";


