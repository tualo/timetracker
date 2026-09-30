CREATE OR REPLACE VIEW `view_readtable_mitarbeiter` AS
select
    `mitarbeiter`.`id` AS `id`,
    `mitarbeiter`.`personal_nummer` AS `personal_nummer`,
    `mitarbeiter`.`kurzbezeichnung` AS `kurzbezeichnung`,
    `mitarbeiter`.`titel` AS `titel`,
    `mitarbeiter`.`anreden` AS `anreden`,
    `mitarbeiter`.`vorname` AS `vorname`,
    `mitarbeiter`.`nachname` AS `nachname`,
    `mitarbeiter`.`bemerkungen` AS `bemerkungen`,
    `mitarbeiter`.`stellenbezeichnung` AS `stellenbezeichnung`,
    `mitarbeiter`.`anstellung` AS `anstellung`,
    `mitarbeiter`.`entlassung` AS `entlassung`,
    `mitarbeiter`.`geburtstag` AS `geburtstag`,
    `mitarbeiter`.`urlaubstage` AS `urlaubstage`,
    `mitarbeiter`.`strasse` AS `strasse`,
    `mitarbeiter`.`plz` AS `plz`,
    `mitarbeiter`.`ort` AS `ort`,
    `mitarbeiter`.`user_login` AS `user_login`,
    `mitarbeiter`.`ortsteil` AS `ortsteil`,
    concat(
        `mitarbeiter`.`vorname`,
        ' ',
        `mitarbeiter`.`nachname`,
        ' (',
        `mitarbeiter`.`kurzbezeichnung`,
        ')'
    ) AS `anzeige_name`
from
    `mitarbeiter`
order by
    `mitarbeiter`.`nachname`,
    `mitarbeiter`.`vorname`