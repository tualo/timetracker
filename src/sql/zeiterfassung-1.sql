/*
explain zeiterfassung

id	varchar(36)
job_id	varchar(36)
mitarbeiter_id	varchar(36)
task_date	date
task_start	datetime
task_end	datetime
gruppen_id	int(11)
hours	decimal(10,2)
remark	text
internal_hour_rate	decimal(10,2)
hour_rate	decimal(10,2)
state	int(11)
create_date	datetime
update_date	datetime
login	varchar(255)
belegnummer	bigint(20)
submit_to_job	bigint(20)

explain time_mat_entry
urno	int(11)
task_day	timestamp
staff_link	int(11)
freelancer_link	int(11)
job_link	int(11)
tos_link	int(11)
task_time	varchar(66)
hours	decimal(15,2)
piece	decimal(15,2)
remark_os	longtext
remark_mat	longtext
int_hourly_rate	decimal(15,2)
markup_os	decimal(15,2)
hourly_rate	decimal(15,2)
material_price	decimal(15,2)
state_os	varchar(3)
state_mat	varchar(3)
invoice_link_os	int(11)
consider_for_freelancer	varchar(3)
invoice_link_mat	int(11)
last_upd_user	decimal(15,0)
last_upd_date	timestamp
status_info_time	varchar(150)
status_info_mat	varchar(150)
cost_center_lnk	int(11)
submit_to_job	bigint(20)

*/

insert into zeiterfassung (id, job_id, mitarbeiter_id, task_date, task_start, task_end, gruppen_id, hours, remark, internal_hour_rate, hour_rate, state, create_date, update_date, login)
select 
    concat(urno),
    job_link,
    staff_link,
    task_day,
    task_day,
    task_day,
    tos_link,
    hours,
    remark_os,
    int_hourly_rate,
    hourly_rate,
    state_os,
    NOW(),
    NOW(),
    last_upd_user
from 
    time_mat_entry
    where 
        true
        and job_link in (select id from tualo_job where length(id) < 3)
        and staff_link in (select id from mitarbeiter)
        and tos_link in (select gruppen_id from artikelgruppen)